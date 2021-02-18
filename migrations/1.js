const up = async(connection) => {
  await connection.query(`
    CREATE TABLE users (
      id INT NOT NULL AUTO_INCREMENT,
      name VARCHAR(250) NULL DEFAULT NULL,
      passwd VARCHAR(250) NULL DEFAULT NULL,
      email VARCHAR(250) NULL DEFAULT NULL,
      whatsapp VARCHAR(250) NULL DEFAULT NULL,
      city VARCHAR(250) NULL DEFAULT NULL,
      state VARCHAR(250) NULL DEFAULT NULL,
      neighborhood VARCHAR(250) NULL DEFAULT NULL,
      PRIMARY KEY (id)
    )
  `)
  await connection.query(`
    CREATE TABLE pets (
      id INT NOT NULL AUTO_INCREMENT,
      pet_name VARCHAR(250) NULL DEFAULT NULL,
      pet_age VARCHAR(50) NULL DEFAULT NULL,
      animal_type VARCHAR(250) NULL DEFAULT NULL,
      description VARCHAR(1000) NULL DEFAULT NULL,
      user_email VARCHAR(250) NULL DEFAULT NULL,
      PRIMARY KEY (id)
    )
  `)
  await connection.query(`
    CREATE TABLE images (
      id INT NOT NULL AUTO_INCREMENT,
      url VARCHAR(500) NULL DEFAULT NULL,
      pets_id INT NOT NULL,
      PRIMARY KEY (id),
      KEY fk_images_pets_index (pets_id),
      CONSTRAINT fk_images_pets_constraint FOREIGN KEY (pets_id) REFERENCES pets(id) ON DELETE CASCADE ON UPDATE CASCADE
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

//KEY fk_pets_users_index (user_email),
//CONSTRAINT fk_pets_users_constraint FOREIGN KEY (user_email) REFERENCES users(email) ON DELETE CASCADE ON UPDATE CASCADE
//FOREIGN KEY (pets_id) REFERENCES pets(id)