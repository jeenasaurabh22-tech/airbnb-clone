const fs = require('fs');
const path = require('path');
const rootDir = require('../utils/pathUtil');
const filePath = path.join(rootDir, 'data', 'homes.json');
const favPath = path.join(rootDir, 'data', 'favourites.json');

module.exports = class Home {
    constructor(houseName, price, location, rating, photoUrl) {
        this.houseName = houseName;
        this.price = price;
        this.location = location;
        this.rating = rating;
        this.photoUrl = photoUrl;
    }

    save(callback) {
        this.id = Math.random().toString();
        const homes = Home.fetchAllSync();
        homes.push(this);
        try {
            fs.writeFileSync(filePath, JSON.stringify(homes, null, 2));
            if (callback) callback();
        } catch (err) {
            console.log('Error writing file:', err);
            if (callback) callback(err);
        }
    }
    static fetchById(id, callback) {
        this.fetchAll(homes => {
      const homeFound = homes.find(home => home.id === id);
      callback(homeFound);
    })
    }

    static fetchAllSync() {
        try {
            const data = fs.readFileSync(filePath);
            if (!data || data.length === 0) {
                fs.writeFileSync(filePath, '[]');
                return [];
            }
            const homes = JSON.parse(data);
            return Array.isArray(homes) ? homes : [];
        } catch (err) {
            fs.writeFileSync(filePath, '[]');
            return [];
        }
    }

    static fetchAll(callback) {
        if (callback) {
            // Async version with callback
            fs.readFile(filePath, (err, data) => {
                if (err || !data || data.length === 0) {
                    fs.writeFile(filePath, '[]', (err) => {
                        callback([]);
                    });
                } else {
                    try {
                        const homes = JSON.parse(data);
                        callback(Array.isArray(homes) ? homes : []);
                    } catch (parseErr) {
                        console.log('Error parsing JSON:', parseErr);
                        callback([]);
                    }
                }
            });
        } else {
            // Sync version without callback
            return this.fetchAllSync();
        }
    }
}