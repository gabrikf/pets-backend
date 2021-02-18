

const init = connection => {
  const create = async(data) => {
    const conn = await connection
    await conn.query('insert into users (name, passwd, email, whatsapp, city, state, neighborhood ) values (?, ?, ?, ?, ?, ?, ?)', data)
  }

  const findById = async(id) => {
    const conn = await connection
    const [results] = await conn.query('select * from users where id = ' + id)
    return results
  }

  const findPassByEmail = async(email) => {
    const conn = await connection
    const [results] = await conn.query('select passwd from users where email = ?', [email])
    return results
  }

  const findAll = async() => {
    const conn = await connection
    const [results] = await conn.query('select * from users')
    return results
  }
  
  const remove = async(id) => {
    const conn = await connection
    await conn.query('delete from users where id=? limit 1', [id])
  }

  const update = async(id, data) => {
    const conn = await connection
    await conn.query('update users set name = ?, email = ?, whatsapp = ?, city = ?, state = ?, neighborhood = ? where id=?', [...data, id])
  }
  return{
    create,
    findAll,
    findById,
    findPassByEmail: findPassByEmail,
    update,
    remove
  }
}

module.exports = init