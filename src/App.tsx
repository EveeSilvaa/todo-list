import React, { useState } from 'react';
import Header from './component/Header';
import TaskList from './component/TaskList';
import TaskForm from "./component/TaskForm";
import Footer from './component/Footer';
import Modal from './component/Modal';
import { ITask } from "./intefaces/Task";
import styles from './App.module.css';

const App = () => {
  const [taskList, setTaskList] = useState<ITask[]>([]);
  const [taskToUpdate, setTaskToUpdate] = useState<ITask | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDelete = (id: number) => {
    setTaskList(taskList.filter(task => task.id !== id));
  };

  const handleEdit = (task: ITask) => {
    setTaskToUpdate(task);
    setIsModalOpen(true);
  };

  const handleUpdate = (id: number, title: string, difficulty: number) => {
    const updatedTaskList = taskList.map(task => {
      if (task.id === id) {
        return { ...task, title, difficulty };
      }
      return task;
    });
    setTaskList(updatedTaskList);
    setIsModalOpen(false);
  };

  return (
    <div className={styles.app}>
      <Header />
      <main className={styles.main}>
        <div>
          <h2>O que você vai fazer?</h2>
          <TaskForm
            btnText="Criar Tarefa"
            taskList={taskList}
            setTaskList={setTaskList}
          />
        </div>
        <div>
          <h2>Suas tarefas:</h2>
          <TaskList
            taskList={taskList}
            handleDelete={handleDelete}
            handleEdit={handleEdit}
          />
        </div>
      </main>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <TaskForm
          btnText="Atualizar Tarefa"
          taskList={taskList}
          setTaskList={setTaskList}
          task={taskToUpdate}
          handleUpdate={handleUpdate}
        />
      </Modal>
    <Footer />
    </div>
  );
};

export default App;