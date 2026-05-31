import { ItemList } from "./utils";
import allUnitsRaw from "../../units/all-optimized.json";
import allBuildingsRaw from "../../buildings/all-optimized.json";
import allTechnologiesRaw from "../../technologies/all-optimized.json";
import allUpgradesRaw from "../../upgrades/all-optimized.json";
import allAbilitiesRaw from "../../abilities/all-optimized.json";
import { Building, Technology, Unit, Upgrade, Ability } from "../types/items";
import { CivInfo, CivAbbr } from "../types/civs";
import { Optimized, optimizedToUnified } from "../lib/utils/items";

import ab from "../../civilizations/abbasid.json";
import ay from "../../civilizations/ayyubids.json";
import by from "../../civilizations/byzantines.json";
import ch from "../../civilizations/chinese.json";
import de from "../../civilizations/delhi.json";
import en from "../../civilizations/english.json";
import fr from "../../civilizations/french.json";
import hl from "../../civilizations/lancaster.json";
import hr from "../../civilizations/hre.json";
import ja from "../../civilizations/japanese.json";
import je from "../../civilizations/jeannedarc.json";
import kt from "../../civilizations/templar.json";
import ma from "../../civilizations/malians.json";
import mo from "../../civilizations/mongols.json";
import od from "../../civilizations/orderofthedragon.json";
import ot from "../../civilizations/ottomans.json";
import ru from "../../civilizations/rus.json";
import zx from "../../civilizations/zhuxi.json";

import sen from "../../civilizations/sengoku.json";
import tug from "../../civilizations/tughlaq.json";
import gol from "../../civilizations/goldenhorde.json";
import mac from "../../civilizations/macedonian.json";

import jin from "../../civilizations/jindynasty.json";

const gameVersion = allUnitsRaw.__game_version__ as string;

const units = new ItemList<Unit>(...optimizedToUnified((allUnitsRaw as typeof allUnitsRaw & { data: Optimized<Unit>[] }).data));
const buildings = new ItemList<Building>(...optimizedToUnified((allBuildingsRaw as typeof allBuildingsRaw & { data: Optimized<Building>[] }).data));
const technologies = new ItemList<Technology>(...optimizedToUnified((allTechnologiesRaw as typeof allTechnologiesRaw & { data: Optimized<Technology>[] }).data));
const upgrades = new ItemList<Upgrade>(...optimizedToUnified((allUpgradesRaw as typeof allUpgradesRaw & { data: Optimized<Upgrade>[] }).data));
const abilities = new ItemList<Ability>(...optimizedToUnified((allAbilitiesRaw as typeof allAbilitiesRaw & { data: Optimized<Ability>[] }).data));

const list = [ab, ay, by, ch, de, en, fr, hl, hr, ja, je, kt, ma, mo, od, ot, ru, zx, sen, tug, gol, mac, jin] as CivInfo[];

const civilizations = {
  ab,
  ay,
  by,
  ch,
  de,
  en,
  fr,
  hl,
  hr,
  ja,
  je,
  kt,
  ma,
  mo,
  od,
  ot,
  ru,
  zx,
  sen,
  tug,
  gol,
  mac,
  jin,
  list
} as Record<CivAbbr, CivInfo> & { list: CivInfo[] };

export const DataRegistry = {
  units,
  buildings,
  technologies,
  upgrades,
  abilities,
  civilizations,
  gameVersion,
};
