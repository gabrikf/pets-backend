const init = connection => {
  const create = async(data) => {
    const conn = await connection
    await conn.query('insert into pets (user_email, pet_name, pet_age, animal_type, description) values (?, ?, ?, ?, ?)',data)
  }

  const remove = async(id) => {
    const conn = await connection
    await conn.query('delete from pets where id=? limit 1', [id])
  }

  const update = async(id, data) => {
    const conn = await connection
    await conn.query('update pets set pat_name = ?, pet_age = ?, animal_type, description = ? where id=?', [...data, id])
  }

  const findImages = async(results) => {
    if (results.length === 0) {
      return []
    }
    const conn = await connection
    const petsIds = results.map(pets => pets.id).join(',')
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
        images: mapImages[pets.id]
      }
    })
    return petss
  }

  const findById = async(id) => {
    const conn = await connection
    const [results] = await conn.query('select * from pets where id = ' + id)
    const petsWithImages = await findImages(results)
    return petsWithImages[0]
  }

  const findByEmail = async(user_email) => {
    const conn = await connection
    const [results] = await conn.query('select * from pets where user_email = ?',user_email)
    return findImages(results)
  }


  const findAll = async() => {
    const conn = await connection
    const [results] = await conn.query('select * from pets')
    return findImages(results)
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
    addImage
  }
}

module.exports = init 