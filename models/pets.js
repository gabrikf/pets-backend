const init = connection => {
  const create = async(data) => {
    const conn = await connection
    data.push(JSON.stringify({}))
    await conn.query('insert into pets (users_id, user_email, pet_name, pet_age, animal_type, genre, size, description, likes) values (?, ?, ?, ?, ?, ?, ?, ?, ?)',data)
  }

  const remove = async(id) => {
    const conn = await connection
    await conn.query('delete from pets where id_pet =? limit 1', [id])
  }

  const update = async(id, data) => {
    const conn = await connection
    await conn.query('update pets set pat_name = ?, pet_age = ?, animal_type, description = ? where id=?', [...data, id])
  }

  const updateLike = async(id, data) => {
    const conn = await connection
    data = JSON.stringify(data)
    return conn.query('update pets set likes = ? where id_pet=?', [data, id])
  }

  const like = async(userId, petId) => {
    const conn = await connection
    return conn.query('INSERT INTO likes (userId, petId) VALUES (?, ?)',[userId, petId])
  }

  const disLike = async(userId, petId) => {
    const conn = await connection
    return conn.query('DELETE FROM likes where userId = ? AND petId = ?',[userId, petId])
  }

  const findImages = async(results) => {
    if (results.length === 0) {
      return []
    }
    const conn = await connection
    const petsIds = results.map(pets => pets.id_pet).join(',')
    const [images] = await conn.query('select * from images where pets_id in (' + petsIds +') group by pets_id')
    const mapImages = images.reduce((anterior, atual) => {
      return {
        ...anterior,
        [atual.pets_id]: atual
      }
    }, {})
    const petss = results.map(pets => {
      return {
        ...pets,
        images: mapImages[pets.id_pet]
      }
    })
    return petss
  }

  const findById = async(id) => {
    const conn = await connection
    const [results] = await conn.query('select * from pets INNER JOIN users ON pets.users_id = users.id  WHERE users.id = ? ORDER BY id_pet DESC', id)
    return findImages(results)
  }

  const findByPetId = async(id) => {
    const conn = await connection
    const [results] = await conn.query('select * from pets INNER JOIN users ON pets.users_id = users.id  WHERE pets.id_pet = ?', id)
    return findImages(results)
  }

  const findByEmail = async(user_email) => {
    const conn = await connection
    const [results] = await conn.query('select * from pets where user_email = ?',user_email)
    return findImages(results)
  }
  const findByOngId = async(ong_id) => {
    const conn = await connection
    const [results] = await conn.query('select * from pets where id= ?',ong_id)
    return findImages(results)
  }
  const findByLikes =  async({ PageSize = 9, currentPage = 0 }  = {},userId) => {
    const conn = await connection
    const [results] = await conn.query(`SELECT * from likes inner join pets on id_pet = petId INNER JOIN users ON pets.users_id = users.id where userId = ? limit ${currentPage*PageSize},${PageSize+1}`,userId)
    const hasNext = results.length > PageSize

    if(results.length > PageSize) {
      results.pop()
    }
    const resultsWithImages =  await findImages(results)

    return {
      data: resultsWithImages,
      hasNext
    }
  }


  const findAll = async() => {
    const conn = await connection
    const [results] = await conn.query('select * from pets INNER JOIN users ON pets.users_id = users.id ')
    return findImages(results)
  }

  const findByOngIdPaginated = async({ PageSize = 9, currentPage = 0 }  = {}, id) => {
    const conn = await connection
    const [results] =  await conn.query( `select * from pets INNER JOIN users ON pets.users_id = users.id WHERE id = ? limit ${currentPage*PageSize},${PageSize+1} `, id)
    const hasNext = results.length > PageSize

    if(results.length > PageSize) {
      results.pop()
    }
    const resultsWithImages =  await findImages(results)

    return {
      data: resultsWithImages,
      hasNext
    }
  }

  const findAllPaginated = async({ PageSize = 9, currentPage = 0 }  = {}) => {
    const conn = await connection
    const [results] =  await conn.query( `select * from pets INNER JOIN users ON pets.users_id = users.id limit ${currentPage*PageSize},${PageSize+1}`)
    const hasNext = results.length > PageSize

    if(results.length > PageSize) {
      results.pop()
    }
    const resultsWithImages =  await findImages(results)

    return {
      data: resultsWithImages,
      hasNext
    }
  }
  const findAllPaginatedByType = async({ PageSize = 9, currentPage = 0 }  = {}, type) => {
    const conn = await connection
    const [results] =  await conn.query( `select * from pets INNER JOIN users ON pets.users_id = users.id WHERE animal_type = ? ORDER BY id_pet DESC limit ${currentPage*PageSize},${PageSize+1}`, type)
    const hasNext = results.length > PageSize

    if(results.length > PageSize) {
      results.pop()
    }
    const resultsWithImages =  await findImages(results)

    return {
      data: resultsWithImages,
      hasNext
    }
  }

const findUrlById = async(id) => {
  const conn = await connection
  const [results] = await conn.query('SELECT url FROM images WHERE pets_id = ?', [id])
  return results
}

  const addImage = async(pets_id, data) => {
    const conn = await connection
    await conn.query('insert into images (pets_id, url) values (?, ?)', [pets_id, ...data ])
  }

  const removeImage = async(petsId, imageId) => {
    const conn = await connection
    await conn.query('delete from images where pets_id = ? and id = ?', [petsId, imageId])
  }

  return {
    create,
    remove,
    removeImage,
    update,
    findAll,
    findById,
    findByEmail,
    findByPetId,
    addImage,
    like,
    disLike,
    updateLike,
    findAllPaginated,
    findUrlById,
    findByOngIdPaginated,
    findByLikes,
    findAllPaginatedByType
  }
}

module.exports = init 
