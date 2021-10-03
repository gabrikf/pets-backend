

const init = connection => {
  const create = async(data) => {
    const conn = await connection
    await conn.query('insert into users (name, passwd, email, whatsapp, city, state, neighborhood ) values (?, ?, ?, ?, ?, ?, ?)', data)
  }

  const findById = async(id) => {
    const conn = await connection
    const [results] = await conn.query('select * from users where id = ?' + id)
    return results
  }

  const findSolicitations =  async(userId) => {
    const conn = await connection
    const [results] = await conn.query(`SELECT * from ongSolicitation inner join users on ongSolicitation.ongId = users.id `)
    return results
  }

  const findByEmail = async(email) => {
    const conn = await connection
    const [results] = await conn.query('select * from users where email = ?', [email])
    return results
  }

  const findPassByEmail = async(email) => {
    const conn = await connection
    const [results] = await conn.query('select passwd from users where email = ?', [email])
    return results
  }
  const findPassByEmailId = async(email) => {
    const conn = await connection
    const [results] = await conn.query('select id, role from users where email = ?', [email])
    return results
  }


  const findAll = async() => {
    const conn = await connection
    const [results] = await conn.query('select * from users')
    return results
  }
  const findOngs = async() => {
    const conn = await connection
    const role = 'ong'
    const [results] = await conn.query('select id, name from users where role = ?', role)
    return results
  }
    const createSolicitation = async(ongId, message) => {
    const conn = await connection
    await conn.query('insert into ongSolicitation (ongId, message) values (?, ?)', [ongId, message])
  }
  const remove = async(id) => {
    const conn = await connection
    await conn.query('delete from users where id=? limit 1', [id])
  }
  const removeuserSolicitation = async(ongId) => {
    const conn = await connection
    return conn.query('DELETE FROM ongSolicitation where ongId = ?',[ongId])
  }
  const updateRole = async(id, role) => {
    const conn = await connection
    await conn.query('update users set role = ?where id=?', [role, id])
  }
  return{
    create,
    findAll,
    findById,
    findByEmail,
    findPassByEmail: findPassByEmail,
    findPassByEmailId,
    updateRole,
    createSolicitation,
    removeuserSolicitation,
    findOngs,
    findSolicitations,
    remove
  }
}

module.exports = init