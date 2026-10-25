import basket from "@/assets/covers/basket-random.jpg";
import soccer from "@/assets/covers/soccer-random.jpg";
import volley from "@/assets/covers/volley-random.jpg";
import boxing from "@/assets/covers/boxing-random.jpg";

/** Locally generated covers for games whose catalog image is missing or blocked. */
export const COVERS: Record<string, string> = {
  "basket-random": basket,
  "soccer-random": soccer,
  "volley-random": volley,
  "boxing-random": boxing,
};
