const $ = require("jquery")

function compare(dict) {
    return dict
}
function sortNumber(a,b) {
   return a - b;
}

const convertStats = async (filename) => {
    let rawstats = require("../uploads/" + filename)
    let stats = [
        {
            name: "Mobs Killed",
            id: 'minecraft:killed',
            stats: {}
        },
        {
            name: "Used or Placed",
            id: "minecraft:used",
            stats: {}
        },
        {
            name: "Items Picked Up",
            id: "minecraft:picked_up",
            stats: {}
        },
        {
            name: "Cause of Death",
            id: "minecraft:killed_by",
            stats: {}
        },
        {
            name: "Tools/Armour Broken",
            id: "minecraft:broken",
            stats: {}
        },
        {
            name: "Items Dropped",
            id: "minecraft:dropped",
            stats: {}
        },
        {
            name: "Items Crafted",
            id: "minecraft:crafted",
            stats: {}
        },
        {
            name: "Blocks Mined",
            id: "minecraft:mined",
            stats: {}
        },
        {
            name: "Miscellaneous",
            id: "minecraft:custom",
            stats: {}
        },
    ]
    for (category in rawstats.stats) {
        for (category1 in stats) {
            if (stats[category1].id == category) {
                for (stat in rawstats.stats[category]) {
                    stats[category1].stats[stat.replace("minecraft:", "").replace(/_/g, " ")] = rawstats.stats[category][stat]
                }
                stats[category1].stats = compare(stats[category1].stats)
            }
        }
    }
    return stats
}
module.exports = {
    convertStats
}