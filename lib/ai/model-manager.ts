import { CactusLM } from 'cactus-react-native';
import { CORPUS_DIR } from '@/constants/storage';
import { AI_CONFIG } from '@/constants/ai';

class ModelManager {
  private static instance: ModelManager;
  private cactusLM: CactusLM | null = null;
  private downloadPromise: Promise<void> | null = null;

  private constructor() {}

  static getInstance(): ModelManager {
    if (!ModelManager.instance) {
      ModelManager.instance = new ModelManager();
    }
    return ModelManager.instance;
  }

  async downloadModel(onProgress?: (progress: number) => void): Promise<void> {
    // Return existing download if in progress
    if (this.downloadPromise) return this.downloadPromise;

    // Create CactusLM instance
    if (!this.cactusLM) {
      this.cactusLM = new CactusLM({
        model: AI_CONFIG.MODEL_NAME,
        contextSize: AI_CONFIG.CONTEXT_SIZE,
        corpusDir: CORPUS_DIR,
      });
    }

    // Download model (returns immediately if already downloaded)
    this.downloadPromise = this.cactusLM.download({ onProgress });
    await this.downloadPromise;
    this.downloadPromise = null;
  }

  async getOrCreateInstance(): Promise<CactusLM> {
    if (!this.cactusLM) {
      this.cactusLM = new CactusLM({
        model: AI_CONFIG.MODEL_NAME,
        contextSize: AI_CONFIG.CONTEXT_SIZE,
        corpusDir: CORPUS_DIR,
      });

      // Download if needed
      await this.downloadModel();

      // Initialize
      await this.cactusLM.init();
    }

    return this.cactusLM;
  }

  async checkIfDownloaded(): Promise<boolean> {
    if (!this.cactusLM) {
      this.cactusLM = new CactusLM({
        model: AI_CONFIG.MODEL_NAME,
        contextSize: AI_CONFIG.CONTEXT_SIZE,
        corpusDir: CORPUS_DIR,
      });
    }

    // Use getModels() to check download status
    const models = await this.cactusLM.getModels();
    const currentModel = models.find(m => m.name === AI_CONFIG.MODEL_NAME);
    return currentModel?.isDownloaded ?? false;
  }

  async destroy(): Promise<void> {
    if (this.cactusLM) {
      await this.cactusLM.destroy();
      this.cactusLM = null;
    }
  }
}

export default ModelManager;
