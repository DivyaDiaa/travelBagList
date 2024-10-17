import { useState } from "react";
import "./App.css";

// const initialItems = [
//   { id: 1, description: "Passports", quantity: 2, packed: false },
//   { id: 2, description: "Socks", quantity: 12, packed: false },
//   { id: 3, description: "Brush", quantity: 1, packed: false },
//   { id: 4, description: "Paste", quantity: 1, packed: false },
//   { id: 5, description: "Dress", quantity: 6, packed: false },
//   { id: 6, description: "Wallet", quantity: 1, packed: false },
//   { id: 7, description: "ID proof", quantity: 3, packed: false },
//   // { id: 8, description: "Makeup kit", quantity: 1, packed: false },
//   // { id: 9, description: "Shoes", quantity: 2, packed: false },
//   // { id: 10, description: "Earnings", quantity: 4, packed: false },
// ];

export default function App() {
  const [items, setItems] = useState([]);

  function handleAdd(item) {
    setItems((items) => [...items, item]);
  }

  function handleDelete(id) {
    setItems((items) => items.filter((item) => item.id !== id));
  }

  function handleCheckIn(id) {
    setItems((items) =>
      items.map((item) =>
        item.id === id ? { ...item, packed: !item.packed } : item
      )
    );
  }

  function handleClearList() {
    const alert = window.confirm(
      "Are you sure you want to delete all the items"
    );
    if (alert) setItems([]);
  }

  return (
    <div className="app">
      <Header />
      <Form onAddFunc={handleAdd} />
      <PackingList
        items={items}
        onDeleteFunc={handleDelete}
        onCheckIn={handleCheckIn}
        onClearClick={handleClearList}
      />
      <Footer items={items} />
    </div>
  );
}

function Header() {
  return <h1>Trip to Madurai</h1>;
}

function Form({ onAddFunc }) {
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState(1);

  function handleSubmit(e) {
    e.preventDefault();

    if (!description) return;
    const newItem = { description, quantity, packed: false, id: Date.now() };

    onAddFunc(newItem);

    setDescription("");
    setQuantity(1);
  }

  return (
    <form className="add-form" onSubmit={handleSubmit} style={{ color: "red" }}>
      <h3>What needs to be packed for the trip?</h3>
      <select
        value={quantity}
        onChange={(e) => setQuantity(Number(e.target.value))}
      >
        {Array.from({ length: 15 }, (_, i) => i + 1).map((num) => (
          <option value={num} key={num}>
            {num}
          </option>
        ))}
      </select>
      <input
        type="text"
        placeholder="Item to be added"
        value={description}
        onChange={(e) => {
          setDescription(e.target.value);
        }}
      />
      <button>Add the item</button>
    </form>
  );
}

function PackingList({ items, onDeleteFunc, onCheckIn, onClearClick }) {
  const [sortBy, setSortBy] = useState("input");
  console.log("Hi");

  let sortedItems;

  if (sortBy === "input") sortedItems = items;
  if (sortBy === "description")
    sortedItems = items
      .slice()
      .sort((a, b) => a.description.localeCompare(b.description));
  if (sortBy === "packed")
    sortedItems = items
      .slice()
      .sort((a, b) => Number(a.packed) - Number(b.packed));
  return (
    <div className="list">
      <ul>
        {sortedItems.map((items) => (
          <Item
            items={items}
            onDeleteFunc={onDeleteFunc}
            onCheckIn={onCheckIn}
            key={items.id}
          />
        ))}
      </ul>

      <div className="actions">
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="input">Sort by input</option>
          <option value="description">Sort by description</option>
          <option value="packed">Sort by packed</option>
        </select>
        <button onClick={onClearClick}>Clear list</button>
      </div>
    </div>
  );
}

function Item({ items, onDeleteFunc, onCheckIn }) {
  return (
    <li>
      <input
        type="checkbox"
        value={items.packed}
        onChange={() => onCheckIn(items.id)}
      />
      <span style={items.packed ? { textDecoration: "line-through" } : {}}>
        {items.quantity} {items.description}
      </span>
      <button onClick={() => onDeleteFunc(items.id)}>❌</button>
    </li>
  );
}

function Footer({ items }) {
  const totalItems = items.length;
  const totalPackedItems = items.filter((item) => item.packed).length;
  const percent = Math.round((totalPackedItems / totalItems) * 100);
  const footerText = `You have ${totalItems} items on your list, already packed ${totalPackedItems} ${
    totalItems >= 2 ? "items" : "item"
  } (${percent}%)`;

  if (!items.length) {
    return (
      <p className="stats">Start adding your items in your packing list</p>
    );
  }
  return (
    <footer className="stats">
      {percent === 100 ? "Ready to fly" : footerText}
    </footer>
  );
}
