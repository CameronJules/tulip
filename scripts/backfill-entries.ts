/**
 * Backfill script to populate journal entries with realistic software developer content
 * Run with: npx tsx scripts/backfill-entries.ts
 */

import { format, subDays } from 'date-fns';
import { getDatabase } from '../lib/database/db';
import { createJournalEntry, getJournalEntry } from '../lib/models/journal-entry';
import { formatContent } from '../lib/utils/date-helpers';
import type { MoodType } from '../lib/models/types';

// Sample content for each section (20-30 words each)
const REMEMBER_OPTIONS = [
  'Code review feedback from Sarah about extracting that utility function into a shared module before shipping the feature tomorrow morning',
  'The database migration script needs to run in staging before deployment. Also check if the new API endpoint handles edge cases properly',
  'Team lead mentioned the performance regression in the dashboard component. Need to profile and optimize before the client demo next week',
  'Prod bug with authentication tokens expiring too quickly. Security team wants a fix before enabling the feature for all users tomorrow',
  'Refactor the user service to use dependency injection pattern. The current implementation is too tightly coupled and hard to test effectively',
  'Update documentation for the new webhook system. Other teams are confused about payload structure and retry logic in error scenarios',
  'Sprint planning is at 10am. Need to size those API integration stories and discuss technical approach with the backend team first',
  'The CI pipeline keeps failing intermittently due to flaky tests. Must fix before it blocks everyone from merging their pull requests',
  'Investigate why Redis cache hit rate dropped by fifteen percent. Could be related to the recent schema changes we deployed last Thursday',
  'Meeting with product to clarify requirements for the export feature. Current specs are vague about file format and data filtering options',
  'Deploy the hotfix for the payment processing bug after QA approval. Monitor error rates closely for the first few hours after release',
  'Pair with junior dev on implementing the search autocomplete feature. Good opportunity to show proper debouncing and state management patterns',
  'Review pull request for the notification system refactor. Implementation looks solid but needs better error handling and logging for debugging',
  'Backend team changed the GraphQL schema again. Need to update type definitions and make sure all queries still work as expected',
  'Tech debt ticket to remove the old reporting module. Confirm with stakeholders that nobody uses it anymore before deleting the code',
];

const MOMENTS_OPTIONS = [
  'Finally fixed that race condition bug that has been haunting production for weeks. The solution was simpler than expected once I understood the async flow. Team celebrated with virtual high-fives during standup this morning.',
  'Productive pair programming session with Alex on the data transformation pipeline. We refactored three hundred lines down to eighty and it is much more readable now. Great learning experience for both of us.',
  'Deployed the new feature to production smoothly. Zero errors in the first hour and positive feedback already coming from early adopters in Slack. Feels good when a release goes exactly as planned.',
  'Had a breakthrough moment debugging the memory leak. Turns out event listeners were not being cleaned up properly. Fixing it improved performance by forty percent across the entire application immediately.',
  'Great code review discussion about error handling patterns. Team agreed on a consistent approach that will make our codebase more maintainable. These architecture conversations are valuable for long term quality.',
  'Helped a colleague troubleshoot their Docker setup issue. Took twenty minutes but saved them hours of frustration. Small acts of kindness matter in team dynamics and build trust over time.',
  'Coffee chat with the new backend engineer about system architecture. They asked thoughtful questions and brought fresh perspective from their previous company. Excited to see what they will contribute here.',
  'Finished writing comprehensive tests for the payment module. Hit ninety five percent coverage and caught two edge cases that would have been bugs in production. Testing really pays off long term.',
  'Presentation on React performance optimization techniques went well. Team seemed engaged and asked good questions. Several people mentioned they will apply the patterns to their current projects right away.',
  'Quiet morning of deep work without meetings. Made significant progress on the dashboard redesign. Sometimes uninterrupted focus time is the most productive thing you can do for a complex project.',
  'User submitted a detailed bug report with reproduction steps and screenshots. Made it super easy to identify and fix the issue quickly. Wish all bug reports were this helpful and thorough.',
  'Refactoring the authentication flow finally clicked after struggling with the design for days. The new approach is cleaner and more secure. Sometimes stepping away helps your brain solve problems unconsciously.',
  'Team retro surfaced some good ideas for improving our development workflow. We agreed to try automated code formatting and earlier QA involvement. Small process improvements compound over time and reduce friction.',
  'Mentoring session with an intern about Git workflows and branching strategies. Their questions made me think more carefully about practices I take for granted. Teaching really deepens your own understanding.',
  'Successful demo of the new analytics dashboard to stakeholders. They loved the real-time data visualization and requested several follow-up features. Positive feedback is always motivating and energizing for the team.',
];

const UNDERSTANDING_OPTIONS = [
  'Trying to figure out the best state management approach for this complex form with nested fields and validation. Redux seems heavy but Context might not scale well. Need to prototype both options.',
  'Debating whether to use WebSockets or server-sent events for the real-time notification feature. Each has tradeoffs in terms of browser support, scalability, and implementation complexity to consider carefully.',
  'Learning GraphQL federation patterns to connect our microservices more elegantly. The documentation is dense and there are many different approaches. Experimentation will help clarify the best solution for us.',
  'Investigating why our API response times increased after the latest deploy. Could be database indexes, inefficient queries, or network latency. Need to profile systematically to identify the actual bottleneck here.',
  'Trying to understand the existing authentication flow before adding OAuth support. The current code lacks documentation and uses patterns I am unfamiliar with. Might need to pair with someone more experienced.',
  'Exploring different approaches to handling file uploads in React Native. Native modules versus JavaScript bridges versus cloud upload services. Each approach has different performance and security implications to weigh.',
  'Wrestling with TypeScript generic constraints for this utility function. The type system is powerful but sometimes the syntax feels overly complex. Stack Overflow and documentation not quite answering my specific question.',
  'Deciding between optimistic updates and pessimistic updates for this user interaction. User experience versus data consistency tradeoffs. Need to consider network conditions and failure scenarios more thoroughly before committing.',
  'Understanding how the legacy payment integration works before migrating to the new provider. Code is old and poorly documented with mysterious magic numbers. Reverse engineering is slow but necessary for safe migration.',
  'Learning Kubernetes deployment strategies for our containerized services. Development environment works fine but production deployment is more complex with health checks, rolling updates, and resource limits to configure properly.',
  'Figuring out the root cause of these intermittent test failures in the CI pipeline. Tests pass locally but fail randomly in the cloud. Timing issues or environment differences are notoriously difficult to debug.',
  'Evaluating different caching strategies for this data-heavy dashboard. Client-side caching versus edge caching versus database query optimization. Need to measure actual performance impact before choosing the best approach here.',
  'Trying to design a clean API interface for this complex business logic. Current implementation is messy with too many responsibilities. Single responsibility principle is clear in theory but harder in practice with real constraints.',
  'Understanding the performance implications of using React Context for frequent updates. Re-render behavior is not intuitive and could cause performance issues at scale. Might need to use a more specialized state library instead.',
  'Debugging a subtle race condition in the asynchronous data fetching logic. The bug only appears under specific timing conditions. Need to add better logging and potentially use a state machine pattern for clarity.',
];

const WINS_OPTIONS = [
  'All tests passing after refactoring that gnarly validation logic. The code is cleaner and easier to understand now. Small wins like this make a big difference.',
  'Positive code review comments on my pull request. Reviewer appreciated the thorough testing and clear documentation. Validation feels good after putting in extra effort to do it right.',
  'Shipped the user profile feature ahead of schedule. Team was impressed with the implementation quality. Feels great to under-promise and over-deliver for once instead of rushing at the deadline.',
  'Fixed three bugs before lunch. Productive morning of focused debugging work. Sometimes you just get in the zone and everything clicks into place perfectly and efficiently.',
  'Improved page load time by two seconds with simple optimization. Users will definitely notice the difference. Performance improvements are very satisfying because the impact is immediate and measurable.',
  'Got the development environment running on the new MacBook in under an hour. Documentation I wrote last month paid off. Investing time in good docs saves so much time later.',
  'Helped unblock two teammates today with quick code reviews and technical guidance. Collaboration is as important as individual contribution. Being available and helpful builds strong team dynamics and trust.',
  'Finished the migration to TypeScript for the user module. Caught five potential bugs during the conversion process. Type safety really does prevent entire categories of runtime errors proactively.',
  'Automated a manual deployment step that was taking fifteen minutes every release. Now it takes thirty seconds. Small automation wins compound into huge time savings over weeks and months.',
  'Database query optimization reduced load times by seventy percent. Just needed better indexes and a JOIN instead of multiple queries. Sometimes the solution is simpler than you think initially.',
  'Successfully debugged a production issue within twenty minutes of it being reported. Good monitoring and logging made all the difference. Preparation and good tooling pay off when things go wrong.',
  'Clean commit history with well-written messages for this feature branch. Future me will appreciate being able to understand the reasoning. Good habits make maintenance easier down the road.',
  'Implemented proper error boundaries in React. No more white screen of death for users. Defensive programming creates better user experience and makes debugging easier when things inevitably fail.',
  'Spent an hour improving test coverage and it already caught a regression. Testing investment pays dividends. This validates the time spent writing comprehensive tests instead of rushing to ship features.',
  'Feature flag system working perfectly for gradual rollout. Can enable for specific users without full deployment. This gives us confidence and control over releases and reduces risk of breaking things.',
];

const DROP_OPTIONS = [
  'Spent too long debating variable naming in code review. The current names are fine and clear enough. Time to move on to more important things.',
  'Overthinking the folder structure for the new module. Any reasonable organization will work fine with proper imports. Perfect is the enemy of good here. Just pick one and ship it.',
  'Got stuck in analysis paralysis comparing different libraries for form validation. They all solve the problem adequately. Need to just choose one and move forward with implementation instead of researching.',
  'Perfectionism on minor CSS alignment issues that nobody will notice. The layout is good enough for the current iteration. Can always refine later if needed based on user feedback.',
  'Rabbit hole researching the optimal caching strategy when a simple approach would work fine. Over-engineering the solution before understanding actual performance requirements. Keep it simple initially and optimize later.',
  'Too much time formatting code manually when we have automated tools for that. Need to trust the tooling and focus on logic instead of aesthetics. Prettier handles this automatically.',
  'Worrying about edge cases that are extremely unlikely to happen in practice. Focus on the common path first. Can handle rare scenarios later if they actually occur in production use.',
  'Bikeshedding about the perfect architecture for this small utility function. Sometimes good enough is actually good enough. Move fast and refactor later if necessary based on real needs.',
  'Reading Hacker News during work hours instead of focusing on actual tasks. Social media and news are distractions that fragment attention. Block these sites during deep work time for better productivity.',
  'Stress about meeting velocity metrics when quality and sustainable pace matter more long term. Rushing leads to technical debt and bugs. Better to ship solid work than hit arbitrary sprint points.',
  'Comparing my progress to other developers on the team. Everyone has different contexts and strengths. Focus on personal growth and contribution instead of competitive comparison which serves no purpose.',
  'Second-guessing architectural decisions that were already made and approved by the team. Move forward with implementation unless new information fundamentally changes requirements. Endless debate prevents progress and wastes time.',
  'Minor refactoring that can wait until there is a real need for the change. Do not refactor speculatively. Change code when you have to touch it for a feature or when it actively causes problems.',
  'Worrying about scalability for features that might never get significant usage. Build for current needs first. Premature optimization wastes time and adds complexity that may never be necessary in practice.',
  'Getting distracted by interesting technical blog posts when I should be writing code. Save articles for lunch break or after work. Staying focused on current tasks is more valuable than constant context switching to learn.',
];

const INTENTIONS_OPTIONS = [
  'Start the day with the database migration testing. Then review those three pull requests that have been waiting. Finally begin designing the new API endpoint schema for the analytics feature.',
  'Pair with the new team member on setting up their local development environment. Help them understand our architecture patterns. Make sure they feel welcome and supported during their first week here.',
  'Deep focus morning session on the performance optimization work. No meetings before lunch if possible. Afternoon for code reviews and team collaboration. Protect morning hours for complex work requiring concentration.',
  'Write comprehensive tests for the payment processing module before adding new features. Technical debt cleanup is important. Better test coverage will prevent bugs and make future changes safer and faster.',
  'Morning standup then finish the search functionality implementation. Get it into code review before end of day. Tomorrow can address feedback and prepare for deployment to staging environment for testing.',
  'Research authentication best practices for the OAuth integration. Take notes and share findings with team. Make an informed decision on implementation approach. Knowledge sharing benefits everyone and improves quality.',
  'Refactor the user service module to improve maintainability. Extract helper functions and add documentation. Leave the codebase better than I found it. Future developers will appreciate clear and well-organized code.',
  'Deploy the hotfix to production first thing and monitor closely. Then attend the sprint planning meeting. Afternoon for starting the next feature on the roadmap. Balance urgent work with planned work effectively.',
  'Code review session in the morning to unblock teammates. Write documentation for the new webhook system. Help others succeed and contribute to team productivity. Individual contribution includes enabling others to work effectively.',
  'Profile the dashboard performance to identify bottlenecks. Implement targeted optimizations based on data. Measure impact to confirm improvements. Data-driven optimization is more effective than guessing at problems randomly.',
  'Fix the flaky tests in the CI pipeline so deploys can proceed smoothly. Team is blocked on this. High-priority work that unblocks everyone is more valuable than starting new features right now.',
  'Meeting with product team to clarify requirements for the upcoming feature. Ask questions and document decisions. Clear requirements prevent rework later. Upfront alignment saves time and prevents misunderstandings during implementation.',
  'Learn more about the GraphQL implementation patterns we are adopting. Read documentation and experiment with examples. Investing in learning pays off with better code quality. Understanding tools deeply makes you more effective.',
  'Clean up my local branches and close old pull requests. Organize tasks and update tickets. Maintain good workflow hygiene. Small organizational habits prevent chaos and make it easier to focus on important work.',
  'Start the new feature implementation with a design document outlining approach and tradeoffs. Get team feedback before writing code. Planning prevents costly mistakes and ensures alignment on technical direction before investing time.',
];

// Mood distribution: ~30% red, ~40% yellow, ~30% green
const MOOD_POOL: MoodType[] = [
  'red', 'red', 'red',
  'yellow', 'yellow', 'yellow', 'yellow',
  'green', 'green', 'green',
];

/**
 * Shuffle array using Fisher-Yates algorithm
 */
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Get a random item from an array
 */
function randomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

/**
 * Generate 20 random dates from the last 30 days
 */
function generateRandomDates(): string[] {
  const today = new Date();
  const allDates: string[] = [];

  // Generate all dates from last 30 days
  for (let i = 1; i <= 30; i++) {
    const date = format(subDays(today, i), 'yyyy-MM-dd');
    allDates.push(date);
  }

  // Shuffle and take first 20
  const shuffled = shuffleArray(allDates);
  return shuffled.slice(0, 20).sort(); // Sort chronologically
}

/**
 * Generate journal entry content
 */
function generateEntryContent(): {
  content: string;
  mood: MoodType;
} {
  const remember = randomItem(REMEMBER_OPTIONS);
  const moments = randomItem(MOMENTS_OPTIONS);
  const understanding = randomItem(UNDERSTANDING_OPTIONS);
  const wins = randomItem(WINS_OPTIONS);
  const drop = randomItem(DROP_OPTIONS);
  const intentions = randomItem(INTENTIONS_OPTIONS);

  const content = formatContent(
    remember,
    moments,
    understanding,
    wins,
    drop,
    intentions
  );

  const mood = randomItem(MOOD_POOL);

  return { content, mood };
}

/**
 * Main backfill function
 */
async function backfillEntries() {
  console.log('🌷 Starting journal entry backfill...\n');

  // Initialize database
  await getDatabase();

  // Generate random dates
  const dates = generateRandomDates();
  console.log(`Generated ${dates.length} random dates from last 30 days\n`);

  let created = 0;
  let skipped = 0;

  for (const date of dates) {
    // Check if entry already exists
    const existing = await getJournalEntry(date);

    if (existing) {
      console.log(`⏭️  Skipped ${date} (entry already exists)`);
      skipped++;
      continue;
    }

    // Generate content and mood
    const { content, mood } = generateEntryContent();

    // Create entry
    try {
      await createJournalEntry({
        date,
        mood,
        content,
      });

      console.log(`✅ Created entry for ${date} (mood: ${mood})`);
      created++;
    } catch (error) {
      console.error(`❌ Failed to create entry for ${date}:`, error);
    }
  }

  console.log(`\n🎉 Backfill complete!`);
  console.log(`   Created: ${created} entries`);
  console.log(`   Skipped: ${skipped} entries`);
  console.log(`   Total: ${created + skipped} dates processed\n`);
}

// Run the backfill
backfillEntries()
  .then(() => {
    console.log('✨ Done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Backfill failed:', error);
    process.exit(1);
  });
