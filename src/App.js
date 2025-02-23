import './App.css';
import { useEffect, useState } from 'react';

function App() {
  const[name, setName]=useState('');
  const[datetime, setDatetime]=useState('');
  const[description, setDescription]=useState('');
  const[transactions, setTransactions]=useState([]);

  useEffect(()=>{
    getTransactions().then(data=>{
      setTransactions(data);
    });
    
  }, []);

  async function getTransactions() {
    const url=process.env.REACT_APP_API_URL+'/transaction';
    const response = await fetch(url)
    return await response.json();
  }

  function addNewTransaction(ev){

    ev.preventDefault();     //otherwise it refreshes every thime we click submit button
    const url=process.env.REACT_APP_API_URL+'/transaction';
    
    const price = name.split(' ')[0];

    fetch(url, {
      method : 'POST',
      headers: {'Content-type': 'application/json'},
      body: JSON.stringify({
        price,
        name:name.substring(price.length + 1).trim(), 
        description, 
        datetime,
      })
    }).then(response=>{
      response.json().then(json=>{
        setName('')
        setDatetime('')
        setDescription('')
        console.log('result',json);

        getTransactions().then(data=>{
          setTransactions(data);
        });
      });
    });
  }

  let balance=0;
  for(const transaction of transactions){
    balance += Number(transaction.price);
  }
  balance = balance.toFixed(2)
  const balanceParts = balance.toString().split('.');
  const fraction = balanceParts[1] || '00';
  balance=balanceParts[0];

  return (
    <main>
      <h1>
      ₹{balance}<span>{fraction}</span>
      </h1>

      <form onSubmit={addNewTransaction}>
        <div className="basic">
          <input type="text" 
            value={name}
            onChange={ev=>setName(ev.target.value)}
            placeholder="+200 New Book" />

          <input type="datetime-local"
            value={datetime}
            onChange={ev=>setDatetime(ev.target.value)}/>
        </div>

        <div className="description">
          <input type="text" 
          value={description}
          onChange={ev=>setDescription(ev.target.value)}
          placeholder="Description"  />
        </div>

        <button type="submit">Add New Transaction</button>
        
      </form>

      
      <div className="transactions">
        {transactions.length > 0 && transactions.map(transaction=>(
          
          
          <div className="transaction" key={transaction._id}>
          <div className="left">
            <div className="name">{transaction.name}</div>
            <div className="description">{transaction.description}</div>
          </div>
          <div className="right">
            {console.log(transaction.price)}
            <div className={`price ${transaction.price < 0 ? 'red' : 'green'}`}>
              {transaction.price}
              </div>
            <div className="datetime">{transaction.datetime}</div>
          </div>
        </div>
          
      ))}
        {/* <div className="transaction">
          <div className="left">
            <div className="name">Samsung TV</div>
            <div className="description">It was time for a new TV</div>
          </div>
          <div className="right">
            <div className="price red">-$500</div>
            <div className="datetime">2022-12-18 15:45</div>
          </div>
        </div> */}
      </div>
    </main>
  );
}

export default App;
