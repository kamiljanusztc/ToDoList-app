import React from 'react';
import io from 'socket.io-client';
import { v4 as uuidv4 } from "uuid";

class App extends React.Component {
  state = {
    tasks: [],
    taskName: '',
  };

  componentDidMount() {
    this.socket = io('localhost:8000');
    this.socket.on('updateTasks', (tasks) => this.updateTasks(tasks));
    this.socket.on('addTask', (task) => this.addTask(task));
    this.socket.on('removeTask', (id) => this.removeTask(id));
    // get removetask with id and transfer local removetask with id
  };

  upadteTasks = (newTasks) => {
    this.setState({ tasks: newTasks });
  };

  addTask = (task) => {
    this.setState({
      tasks: [ ...this.state.tasks, task ]
    });
  };

  removeTask = (id, local) => {
    this.setState({
      tasks: this.state.tasks.filter(task => task.id !== id),
    });
    if (local) {
      this.socket.emit('removeTask', id);
    }
  };

  submitForm = (event) => {
    event.preventDefault();
    const task = { name: this.state.taskName, id: uuidv4() };
    this.addTask(task);
    this.socket.emit("addTask", task);
    this.setState({ taskName: '' });
  };

  render() {
    const { tasks, taskName } = this.state;
    console.log('add to array', tasks);
    return (
      <div className="App">
    
        <header>
          <h1>TASK MANAGER</h1>
        </header>

        <section className="tasks-section" id="tasks-section">
          <h2>Tasks</h2>
    
          <ul className="tasks-section__list" id="tasks-list">
            {tasks.map(task => (
              <li className="task" key={task.id} >
                { task.name }
                <button className="btn btn--red" onClick={ () => this.removeTask(task.id, task.name) }>Remove</button>
              </li>
            ))}
          </ul>
    
          <form id="add-task-form" onSubmit={ event => this.submitForm(event) }>
            <input className="text-input" autoComplete="off" type="text" placeholder="Type your description" id="task-name" value={ taskName } onChange={event => this.setState({ taskName: event.currentTarget.value })}/>
            <button className="btn" type="submit">Add</button>
          </form>
    
        </section>
      </div>
    );
  };

};

export default App;