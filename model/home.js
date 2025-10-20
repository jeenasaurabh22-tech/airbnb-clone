
const db=require('../utils/databaseUtil');


module.exports = class Home {
    constructor(houseName, price, location, rating, photoUrl,description,id) {
        this.houseName = houseName;
        this.price = price;
        this.location = location;
        this.rating = rating;
        this.photoUrl = photoUrl;
        this.description=description;
        this.id = id;
    }

    save() {
      if (
    !this.houseName ||
    !this.price ||
    !this.location ||
    !this.rating ||
    !this.photoUrl ||
    !this.description
  ) {
    return Promise.reject('All fields are required. Please fill in all fields.');
  }

  
  if (isNaN(this.price) || isNaN(this.rating)) {
    return Promise.reject('Price and Rating must be valid numbers.');
  }
      if(this.id){
        return db.execute('UPDATE homes SET houseName = ?, price = ?, location = ?, rating = ?, photoUrl = ?, description = ? WHERE id = ?', [
          this.houseName, this.price, this.location, this.rating, this.photoUrl, this.description, this.id
      ]);
      }
      else{
        return db.execute('INSERT INTO homes (houseName, price, location, rating, photoUrl, description) VALUES (?, ?, ?, ?, ?, ?)', [
          this.houseName, this.price, this.location, this.rating, this.photoUrl, this.description
      ]);

      }
      
  }
    static fetchById(id) {
      return db.execute('SELECT * FROM homes WHERE id = ?', [id]);
        
    }
    static deleteById(id){
      return db.execute('DELETE FROM homes WHERE id = ?', [id]);
        
    }

    static fetchAllSync() {
       
    }

    static fetchAll() {
         return db.execute('SELECT * FROM homes');
    }
}