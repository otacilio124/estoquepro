import {
  CarouselRepository,
  CarouselSlideInput,
  CarouselSlideItem,
} from "@/repositories/CarouselRepository";

export const CarouselService = {
  async listSlides(onlyActive = false): Promise<CarouselSlideItem[]> {
    return CarouselRepository.list(onlyActive);
  },

  async getSlideById(id: number): Promise<CarouselSlideItem | null> {
    const slide = CarouselRepository.getById(id);
    return slide ?? null;
  },

  async createSlide(input: CarouselSlideInput): Promise<number> {
    return CarouselRepository.create(input);
  },

  async updateSlide(id: number, input: CarouselSlideInput): Promise<void> {
    CarouselRepository.update(id, input);
  },

  async toggleActive(id: number): Promise<void> {
    CarouselRepository.toggleActive(id);
  },

  async deleteSlide(id: number): Promise<void> {
    CarouselRepository.delete(id);
  },
};
