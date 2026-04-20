import supabase from '../config/supabase.js'

export async function criarEvento(req, res) {
  const { titulo, date } = req.body
  const userId = req.userId

  if (!titulo || !date) {
    return res.status(400).json({ message: 'Título e data são obrigatórios' })
  }

  const { data, error } = await supabase
    .from('calendar')
    .insert([{ titulo, date, user_id: userId }])
    .select()

  if (error) {
    return res.status(500).json({ message: 'Erro ao criar evento' })
  }

  return res.status(201).json(data[0])
}

export async function listarEventos(req, res) {
  const userId = req.userId
  const { date } = req.query

  let query = supabase
    .from('calendar')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: true })

  if (date) {
    query = query.eq('date', date)
  }

  const { data, error } = await query

  if (error) {
    return res.status(500).json({ message: 'Erro ao buscar eventos' })
  }

  return res.json(data)
}

export async function deletarEvento(req, res) {
  const { id } = req.params
  const userId = req.userId

  const { error } = await supabase
    .from('calendar')
    .delete()
    .eq('id', id)
    .eq('user_id', userId)

  if (error) {
    return res.status(500).json({ message: 'Erro ao deletar evento' })
  }

  return res.status(200).json({ message: 'Evento deletado' })
}