import type { Skill } from "@/types";
import { foundationSkills } from "./foundation";
import { chemicalSkills } from "./chemical";
import { biotechSkills } from "./biotech";
import { mechanicalSkills } from "./mechanical";
import { civilSkills } from "./civil";
import { electricalSkills } from "./electrical";
import { electronicsSkills } from "./electronics";
import { computerSkills } from "./computer";
import { materialsSkills } from "./materials";
import { environmentalSkills } from "./environmental";
import { aerospaceSkills } from "./aerospace";

export { branches } from "./branches";
export { careers } from "./careers";
export { internships } from "./internships";

export const skills: Skill[] = [
  ...foundationSkills,
  ...chemicalSkills,
  ...biotechSkills,
  ...mechanicalSkills,
  ...civilSkills,
  ...electricalSkills,
  ...electronicsSkills,
  ...computerSkills,
  ...materialsSkills,
  ...environmentalSkills,
  ...aerospaceSkills,
];
