import supabase from '../config/supabase.js'

export async function criarTarefa(req, res) {
  const { titulo, date } = req.body
  const userId = req.userId

  if (!titulo) {
    return res.status(400).json({ message: 'Título é obrigatório' })
  }

  const { data, error } = await supabase
    .from('tasks')
    .insert([{ titulo, date, completed: false, user_id: userId }])
    .select()

  if (error) {
    return res.status(500).json({ message: 'Erro ao criar tarefa' })
  }

  return res.status(201).json(data[0])
}

export async function listarTarefas(req, res) {
  const userId = req.userId
  const { date, from, to } = req.query

  let query = supabase
    .from('tasks')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: true })

  if (date) {
    query = query.eq('date', date)
  } else if (from && to) {
    query = query.gte('date', from).lte('date', to)
  }

  const { data, error } = await query

  if (error) {
    return res.status(500).json({ message: 'Erro ao buscar tarefas' })
  }

  return res.json(data)
}

export async function completarTarefa(req, res) {
  const { id } = req.params
  const { completed } = req.body
  const userId = req.userId

  const { data, error } = await supabase
    .from('tasks')
    .update({ completed })
    .eq('id', id)
    .eq('user_id', userId)
    .select()

  if (error || !data.length) {
    return res.status(500).json({ message: 'Erro ao atualizar tarefa' })
  }

  return res.json(data[0])
}

export async function deletarTarefa(req, res) {
  const { id } = req.params
  const userId = req.userId

  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', id)
    .eq('user_id', userId)

  if (error) {
    return res.status(500).json({ message: 'Erro ao deletar tarefa' })
  }

  return res.status(200).json({ message: 'Tarefa deletada' })
}