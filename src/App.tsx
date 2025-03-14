import React, { useState } from 'react';
import Header from './component/Header';
import Footer from './component/Footer';
import styles from "./App.module.css";
import TaskForm from './component/TaskForm';
import TaskList from './component/TaskList';
import { ITask } from './intefaces/Task';

function App() {
  
  const [taskList, setTaskList] = useState<ITask[]>([]);

  return (
    <div>
    <Header />
    <main className={styles.main}>
    <h2>O que você vai fazer?</h2>
    <TaskForm btnText="Criar Tarefa" taskList={taskList} setTaskList={setTaskList}/>
    <h2>Suas tarefas</h2>
    <TaskList  taskList={taskList}/>
    </main>
    <Footer />
  </div>
  );
}

export default App;
