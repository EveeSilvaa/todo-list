import React from 'react';
import Header from './component/Header';
import Footer from './component/Footer';
import styles from "./App.module.css";
import TaskForm from './component/TaskForm';
import TaskList from './component/TaskList';


function App() {
  return (
    <div>
    <Header />
    <main className={styles.main}>
    <h2>O que você vai fazer?</h2>
    <TaskForm btnText="Criar Tarefa" />
    <h2>Suas tarefas</h2>
    <TaskList />
    </main>
    <Footer />
  </div>
  );
}

export default App;
