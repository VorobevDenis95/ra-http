import { useEffect, useState } from 'react'
import './App.css'
import Form from './components/Form';
import Note from './components/Note';
import uuid from 'react-uuid';
import imgUpdate from './img/svg/update.svg';

function App() {
  const [list, setList] = useState<Array>([]); 
  const [data, setData] = useState({
    id: uuid(),
    content: '',
  });


  const handlerOnChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setData(prevState => {
      return {
        ...prevState,
        content: e.target.value,
      }
    })
  } 

  const onSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    addData(data);  

  }

  const url : string = 'http://localhost:7070/notes';

  async function getData() {
    try {
      const responce = await fetch(url);
      const data = await responce.json();
      setList(data);
    } catch (error) {
      console.log(error)
    }
  }

  async function addData(data: { id: string; content: string; }) {
    try {
      const responce = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(data),
      });
      if (responce.ok) {
        getData();
        setData((prevState => {
          return {
            ...prevState,
            content: '',
          }
        }))
      }
    } catch (error) {
     console.log(error) 
    }
  }

    useEffect(() => {
      getData();
    }, []); 

    async function deleteItem (id: string) {
      try {
        const responce = await fetch(`${url}/${id}`, {
          method: 'DELETE',
        });
        if (responce.ok) {
          getData();
        }
      } catch (error) {
        console.log(error)
      }
    } 


    return (
      <div className="container">
        <header className='header__container'>
          <h1 className="title__header">Notes</h1>
          {<img src={imgUpdate} onClick={getData}/>}          
        </header>
        <div className="list">
          {list.map((el) => (<Note key={el.id} id={el.id} text={el.content} 
          onClickDelete={() => deleteItem(el.id)}/>))}
        </div>
         <Form value={data.content} onChangeTextarea={(e) => handlerOnChange(e)} onSubmitForm={onSubmit}/>
      </div>
    );
}

export default App
