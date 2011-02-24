﻿
/* Return the amount of xp required for given level */
/* Outdated with patch 0.200
function getXPForLevel(level) {
	//XP to level formula: next_level = round((current_level * 2700) * (1.15 ^ current_level))
	return Math.round( (level - 1) * 2700 * Math.pow(1.15, level - 1));
} */
function getXPForLevel(targetLevel) {
	targetLevel = targetLevel - 1;
	if (targetLevel < 1)
		return 0;
		
	// Up to lvl 30, use the cool formula
	if (targetLevel <= 29) {
		return Math.round((250 * Math.pow(1.26, targetLevel - 1) + targetLevel * 550) * 25 - 17000);
	// At level 31, nice value
	} else if (targetLevel == 30) {
		return 8892403;
	// After that, double the previous xp for each level
	} else {
		return getXPForLevel(targetLevel) * 2;
	}
}

/* Return the level achievable with given amount of xp */
/* Outdated with patch 0.200
function getLevelForXp(xp) {
	var level = 1;
	
	while(getXPForLevel(level) < xp) {
		level++;
		
		if (getXPForLevel(level) > xp) {
			level--;
			break;
		}
	}
	
	return level;
}*/
function getLevelForXp(xp) {
	var level = 1;
	
	while(newGetXpForLevel(level) < xp) {
		level++;
		
		if (newGetXpForLevel(level) > xp) {
			level--;
			break;
		}
	}
	
	return level;
}

function getTimeForXP(xpNeeded, xpGainPerMinute, generation, multiplier) {
	var xpGain = (xpGainPerMinute * (1 + (generation - 1) / 10.0) * multiplier);
	var minutesNeeded = xpNeeded / xpGain;
	
	var hours = Math.floor(minutesNeeded / 60);
	var minutes = Math.floor(minutesNeeded - hours * 60);
	
	var formattedTime = "";
	if (hours < 10)
		formattedTime += "0";
	
	formattedTime += hours;
	formattedTime += ":";
	
	if (minutes < 10)
		formattedTime += "0";
	
	formattedTime += minutes;
	
	return formattedTime;
}

/* Returns total hit points for given strength and ironflesh */
function getHitpoints(strength, ironflesh) {

	/* 35 base, 1/strength, 2/ironflesh */
	return 35 + strength + ironflesh * 2;
}

/* Returns total WPP cost for given WPF value*/
function getWPPCost(targetWPF) {

	var wpf = 0;
	var wppCost = 0;
	while (wpf < targetWPF) {
		var nextPointCost = getNextWPFCost(wpf);
		wppCost += nextPointCost;
		wpf++;
	}
	return wppCost;
}

/* Returns cost for next WPF point based on current */
/* Outdated pre-patch 0.200 function
function getNextWPFCost(nextWpf) {
	return Math.floor(0.006 * Math.pow(nextWpf, 1.35) + 1);
}*/
function getNextWPFCost(wpf) {
	var cost = 0;
	
	if (wpf < 51){
		cost = 1;
	} else if (wpf < 72) {
		cost = 2;
	} else if (wpf < 88) {
		cost = 3;
	} else if (wpf < 101) {
		cost = 4;
	} else if (wpf < 113) {
		cost = 5;
	} else if (wpf < 124) {
		cost = 6;
	} else if (wpf < 134) {
		cost = 7;
	} else if (wpf < 143) {
		cost = 8;
	} else if (wpf < 151) {
		cost = 9;
	} else if (wpf < 160) {
		cost = 10;
	} else if (wpf < 167) {
		cost = 11;
	} else if (wpf < 175) {
		cost = 12;
	} else if (wpf < 182) {
		cost = 13;
	} else if (wpf < 189) {
		cost = 14;
	} else if (wpf < 195) {
		cost = 15;
	} else if (wpf < 201) {
		cost = 16;
	} else if (wpf < 208) {
		cost = 17;
	} else {
		cost = 18;
	}
	
	return cost;
}

/* Gets available WPP at given level and weapon master skill level */
function getAvailableWPP(targetLevel, targetWeaponmaster) {
	
	// Starting WPP of 30 + 1 in all 5 WPFs
	var totalWPP = 30 + 5;
	
	// Base wpp for level
	for (var lvl = 2; lvl <= targetLevel; lvl++) {
		var wppForLevel = 5 + Math.floor(lvl / 5);
		totalWPP += wppForLevel;
	}
	
	// Bonus WPP from Weapon master
	for (var wm = 1; wm <= targetWeaponmaster; wm++) {
		var wppForWm = (20 + (10 * wm));
		totalWPP += wppForWm;
	}
	
	return totalWPP;
}

/* Returns available skill points at given level */
function getAvailableSkillpoints(level) {
	/* 2 to start with, 1/level increase starts at level 2 */
	return level - 1 + 2;
}

/* Returns encumberance for given armor weights */
function getEncumberance(head_armor, body_armor, leg_armor, hand_armor) {
	var encumberance = 0;
	encumberance += head_armor * 3;
	encumberance += body_armor;
	encumberance += hand_armor * 2;
	encumberance += leg_armor;
	encumberance -= 5

	if (encumberance < 0) 
		encumberance = 0;

	encumberance = Math.floor( Math.pow(encumberance, 1.12));
	
	return encumberance;
}

/* Returns effective archery wpf, pd and melee wpf for given encumberance in three-object array */
function getEffectiveWpfs(pd, archery_wpf, melee_wpf, encumberance) {
	pd = parseInt(pd);
	archery_wpf = parseInt(archery_wpf);
	melee_wpf = parseInt(melee_wpf);
	
	encumberance = parseFloat(encumberance);					
	
	var nerfed_wpf = archery_wpf - (pd * 14);

	if (nerfed_wpf < 1) 
		nerfed_wpf = 1;					

	nerfed_wpf = Math.floor( Math.pow(nerfed_wpf, 1.16));

	var encumbered_archery_wpf = nerfed_wpf - (encumberance * 2.5);

	var pd_malus = 0;

	if (encumbered_archery_wpf < 0) {
		encumbered_archery_wpf = 1;
		pd_malus = Math.abs(encumbered_archery_wpf);
		pd_malus = Math.floor(pd_malus / 25) + 1;
	} else if (encumbered_archery_wpf < 1) {
		encumbered_archery_wpf = 1;
	}

	var effective_pd = pd - pd_malus;

	var encumbered_melee_wpf = melee_wpf - encumberance;

	if (encumbered_melee_wpf < 1) 
		encumbered_melee_wpf = 1
	
	return [encumbered_archery_wpf, effective_pd, encumbered_melee_wpf];
}

function getWeaponDamage(str, ps, wpf, dmg, dmgType, weaponCat, mounted, shield, arm) {

	str = parseInt(str);
	ps = parseInt(ps);
	wpf = parseInt(wpf);
	dmg = parseInt(dmg);
	arm = parseInt(arm);


	// Calculate penalty modifier. Magical numbers by Urist
	var penalty_mod = null;
	if (mounted) {
		// Mounted		
		if (shield) {
			switch (weaponCat) {
				case "1H":
					penalty_mod = 1; // Mounted + shield + 1h
					break;
				case "1/2H":
					penalty_mod = 0.85; // Mounted + shield + 1.5h
					break;
				case "Polearm (1h)":
					penalty_mod = 0.72; // Mounted + shield + polearm
					break;
				default:
					penalty_mod = null; // Error
					break;
			}		
		} else {
			switch (weaponCat) {
				case "1H":
					penalty_mod = 1; // Mounted + 1h
					break;
				case "1/2H":
					penalty_mod = 0.85; // Mounted + 1.5h
					break;
				case "2H":
					penalty_mod = 0.765; // Mounted + 2h
					break;
				case "Polearm (1h)":
					penalty_mod = 0.72; // Mounted + 1h polearm
					break;
				case "Polearm (2h)":
					penalty_mod = 0.65; // Mounted + 2h polearm
					break;
				default:
					penalty_mod = null; // Error
					break;				
			}
		}
		
	} else {
		// On foot
		if (shield) {
			// With shield
			switch (weaponCat) {
				case "1H":
					penalty_mod = 1; // 1h + shield
					break;
				case "1/2H":
					penalty_mod = 0.85; // 1,5h + shield
					break;
				case "Polearm (1h)":
					penalty_mod = 0.72; // polearm + shield
					break;
				default:
					penalty_mod = null; // Error
					break;			
			}
		} else {
			// Without shield and on foot penalty modifier is 1 for all weapons
			penalty_mod = 1;
		}
	}	
	if (penalty_mod == null) {
		throw "Invalid weapon combination";
	}
	
	// Magical numbers
	var hold_mod = 0.85;
	var ps_bonus = 0.08;
	var wpf_bonus = 0.178;
	var armor_soak_factor_against_cut = 0.8;
	var armor_soak_factor_against_pierce = 0.65;
	var armor_soak_factor_against_blunt = 0.5;
	var armor_reduction_factor_against_cut = 1.0;
	var armor_reduction_factor_against_pierce = 0.5;
	var armor_reduction_factor_against_blunt = 0.75;
	//ps = str / 3 (Removed, PS is not always maxed)
	
	// Potential maximum damage swing can inflict
	var potential_damage = penalty_mod * ( hold_mod * dmg * ( 1 + ps * ps_bonus ) * ( 1 + wpf / 100.0 * wpf_bonus ) + str / 5 );
	
	// Armor soak and reduction factors based on damage type
	var soak_factor = null;
	var reduction_factor = null;
	switch (dmgType) {
		case "Cut":
			soak_factor = armor_soak_factor_against_cut;
			reduction_factor = armor_reduction_factor_against_cut;
			break;
		case "Pierce":
			soak_factor = armor_soak_factor_against_pierce;
			reduction_factor = armor_reduction_factor_against_pierce;
			break;
		case "Blunt":
			soak_factor = armor_soak_factor_against_blunt;
			reduction_factor = armor_reduction_factor_against_blunt;
			break;
		default:
			break;
	}	
	if (soak_factor == null || reduction_factor == null) {
		throw "Invalid damage type: " + dmgType;
	}
	
	//
	// Damage soak
	
	// Urist:
	// "However here is where randomisation kicks in again. I think that a
	// random number between the full and the half armor value are used."
	var min_damage = potential_damage - 1 * arm * soak_factor;
	var max_damage = potential_damage - 0.5 * arm * soak_factor;
	
	//Damage reduction
	
	// Urist:
	// "The same random armor between the half and full armor points
	// of the armor is used."
	min_damage = min_damage * (1 - arm / 100.0 * reduction_factor);
	max_damage = max_damage * ( 1 - 0.5 * arm / 100.0 * reduction_factor );
	
	// Round to integer
	min_damage = Math.round(min_damage);
	max_damage = Math.round(max_damage);
	
	// No negative damage (no healing ;__; )
	if (min_damage < 0) {
		min_damage = 0;
	}
	if (max_damage < 0) {
		max_damage = 0;
	}
	
	return [min_damage, max_damage];
}