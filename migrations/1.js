const up = async(connection) => {
  await connection.query(`
    CREATE TABLE users (
      id INT NOT NULL AUTO_INCREMENT,
      name VARCHAR(100) NOT NULL,
      passwd VARCHAR(100) NOT NULL,
      email VARCHAR(100) NOT NULL,
      whatsapp VARCHAR(250) NOT NULL,
      city VARCHAR(250) NULL DEFAULT NULL,
      state VARCHAR(250) NULL DEFAULT NULL,
      neighborhood VARCHAR(100) NULL DEFAULT NULL,
      PRIMARY KEY (id)
    )
  `)
  await connection.query(`
    CREATE TABLE pets (
      id_pet INT NOT NULL AUTO_INCREMENT,
      pet_name VARCHAR(250) NULL DEFAULT NULL,
      pet_age varchar(50) NULL DEFAULT NULL,
      animal_type VARCHAR(100) NOT NULL,
      breed VARCHAR(50) NULL DEFAULT NULL,
      likes TEXT NULL DEFAULT NULL,
      description VARCHAR(200) NULL DEFAULT NULL,
      user_email VARCHAR(100) NULL DEFAULT NULL,  
      users_id INT NOT NULL,
      CONSTRAINT fk_pets_users_constraint FOREIGN KEY (users_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
      PRIMARY KEY (id_pet)
    )
  `)

  await connection.query(`
    CREATE TABLE images (
      id_img INT NOT NULL AUTO_INCREMENT,
      url VARCHAR(500) NULL DEFAULT NULL,
      pets_id INT NOT NULL,
      PRIMARY KEY (id_img),
      KEY fk_images_pets_index (pets_id),
      CONSTRAINT fk_images_pets_constraint FOREIGN KEY (pets_id) REFERENCES pets(id_pet) ON DELETE CASCADE ON UPDATE CASCADE
    )
  `)
}

const down = async(connection) => {
  await connection.query(`
    DROP TABLE users
  `)
  await connection.query(`
    DROP TABLE pets
  `)
  await connection.query(`
    DROP TABLE images
  `)
}

module.exports = {
  up, down
}

