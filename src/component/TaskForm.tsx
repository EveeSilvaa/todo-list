import React from 'react'
import styles from "./TaskForm.module.css";

interface Props {
  btnText: string
}

const TaskForm = ({ btnText }: Props) => {
  return (
  <form className={styles.form}>
    <div className={styles.input_container}>
        <label htmlFor="title">Título</label>
        <input type="text" name="title" placeholder="Título de tarefa"/>
    </div>
    <div className={styles.input_container}>
      <label htmlFor="dificulty">Dificuldade</label>
      <input 
        type="text" 
        name="dificulty" 
        placeholder="Dificuldade da tarefa"
      />
    </div>
    <input className={styles.btn} type="subimit" value={btnText}/>
  </form>
  )
}

export default TaskForm