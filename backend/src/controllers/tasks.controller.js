import supabase from '../config/supabase.js'

export async function CriarTarefa(req, res) {
  const { titulo } = req.body
  const userId = req.userId  // Obtido do middleware de autenticação

  if (!titulo) {
    return res.status(400).json({
      message: "Título é obrigatório"
    })
  }

  try {
    // Cria a tarefa no Supabase associada ao usuário autenticado
    const { data, error } = await supabase
      .from('tasks')
      .insert([{
        titulo,
        user_id: userId,
        completed: false
      }])
      .select()

    if (error) {
      console.error('Erro ao criar tarefa:', error)
      return res.status(500).json({
        message: "Erro ao criar tarefa"
      })
    }

    return res.status(201).json({
      message: "Tarefa criada com sucesso",
      task: data[0]
    })
  } catch (err) {
    console.error('Erro interno:', err)
    return res.status(500).json({
      message: "Erro interno do servidor"
    })
  }
}

// Função para obter todas as tarefas do usuário
export async function ObterTarefas(req, res) {
  const userId = req.userId  // Obtido do middleware de autenticação

  try {
    // Busca as tarefas do usuário no Supabase
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Erro ao obter tarefas:', error)
      return res.status(500).json({
        message: "Erro ao obter tarefas"
      })
    }

    return res.status(200).json({
      tasks: data
    })
  } catch (err) {
    console.error('Erro interno:', err)
    return res.status(500).json({
      message: "Erro interno do servidor"
    })
  }
}

// Função para atualizar uma tarefa
export async function AtualizarTarefa(req, res) {
  const taskId = req.params.id
  const userId = req.userId  // Obtido do middleware de autenticação
  const { titulo, completed } = req.body

  try {
    // Verifica se a tarefa pertence ao usuário
    const { data: task, error: fetchError } = await supabase
      .from('tasks')
      .select('*')
      .eq('id', taskId)
      .eq('user_id', userId)
      .single()

    if (fetchError) {
      if (fetchError.code === 'PGRST116') {
        return res.status(404).json({
          message: "Tarefa não encontrada"
        })
      }
      console.error('Erro ao buscar tarefa:', fetchError)
      return res.status(500).json({
        message: "Erro ao buscar tarefa"
      })
    }

    // Atualiza a tarefa
    const { data, error: updateError } = await supabase
      .from('tasks')
      .update({
        ...(titulo !== undefined && { titulo }),
        ...(completed !== undefined && { completed })
      })
      .eq('id', taskId)
      .eq('user_id', userId)
      .select()
    
    if (updateError) {
      console.error('Erro ao atualizar tarefa:', updateError)
      return res.status(500).json({
        message: "Erro ao atualizar tarefa"
      })
    }

    return res.status(200).json({
      message: "Tarefa atualizada com sucesso",
      task: data[0]
    })
  } catch (err) {
    console.error('Erro interno:', err)
    return res.status(500).json({
      message: "Erro interno do servidor"
    })
  }
}

// Função para excluir uma tarefa
export async function ExcluirTarefa(req, res) {
  const taskId = req.params.id
  const userId = req.userId  // Obtido do middleware de autenticação

  try {
    // Exclui a tarefa do Supabase
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', taskId)
      .eq('user_id', userId)

    if (error) {
      console.error('Erro ao excluir tarefa:', error)
      if (error.code === 'PGRST116') {
        return res.status(404).json({
          message: "Tarefa não encontrada"
        })
      }
      return res.status(500).json({
        message: "Erro ao excluir tarefa"
      })
    }

    return res.status(200).json({
      message: "Tarefa excluída com sucesso"
    })
  } catch (err) {
    console.error('Erro interno:', err)
    return res.status(500).json({
      message: "Erro interno do servidor"
    })
  }
}