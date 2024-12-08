/* eslint-disable react/prop-types */
import { useState } from 'react';
import { coffeeOptions } from '../utils';
import Modal from './Modal';
import Authentication from './Authentication';
import { useAuth } from '../context/AuthContext';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase';

export default function CoffeeForm(props) {
  const { isAuthenticated } = props;
  //* MARK: STATE
  const [showModal, setShowModal] = useState(false);
  const [SelectedCoffee, setSelectedCoffee] = useState(null);
  const [showCoffeeTypes, setShowCoffeeTypes] = useState(false);
  const [coffeeCost, setCoffeeCost] = useState(0);
  const [hour, setHour] = useState(0);
  const [min, setMin] = useState(0);

  const { globalData, globalUser, setGlobalData } = useAuth();

  //* MARK: Functions
  async function handleSubmitForm() {
    if (!isAuthenticated) {
      setShowModal(true);
      return;
    }
    // * Define a guard clause, that only submits the form when it is completed.
    if (!SelectedCoffee) return;

    try {
      // * Then, create a new data object
      const newGlobalData = { ...(globalData || {}) };
      const nowTime = Date.now();
      const timeToSubtract = hour * 60 * 60 * 1000 + min * 60 * 1000; //* (hour in ms) + (minute in ms)
      const timestamp = nowTime - timeToSubtract; //* When person consumed the coffee
      const newData = { name: SelectedCoffee, cost: coffeeCost };
      newGlobalData[timestamp] = newData;
      console.log(timestamp, SelectedCoffee, coffeeCost, hour, min);

      // * update the global state
      setGlobalData(newGlobalData);

      //* persist the data in the firebase firestore
      const userRef = doc(db, 'users', globalUser.uid); //* reference to the document
      const res = await setDoc(
        userRef,
        {
          [timestamp]: newData,
        },
        { merge: true }
      );
      setSelectedCoffee(null);
      setHour(0);
      setMin(0);
      setCoffeeCost(0);
    } catch (err) {
      console.log(err.message);
    }
  }

  function handleCloseModal() {
    setShowModal(false);
  }

  return (
    <>
      {showModal && (
        <Modal handleCloseModal={handleCloseModal}>
          <Authentication handleCloseModal={handleCloseModal} />
        </Modal>
      )}
      <div className="section-header">
        <i className="fa-solid fa-pencil"></i>
        <h2>Start Tracking Your Coffee Today</h2>
      </div>
      <h4>Select Coffee Type</h4>
      <div className="coffee-grid">
        {coffeeOptions.slice(0, 5).map((option, optionIndex) => {
          return (
            <button
              onClick={() => {
                setSelectedCoffee(option.name);
                setShowCoffeeTypes(false);
              }}
              className={
                'button-card ' +
                (SelectedCoffee === option.name
                  ? ' coffee-button-selected'
                  : '')
              }
              key={optionIndex}
            >
              <h4>{option.name}</h4>
              <p>{option.caffeine}mg</p>
            </button>
          );
        })}
        <button
          onClick={() => {
            setShowCoffeeTypes(true);
            setSelectedCoffee(null);
          }}
          className={
            'button-card ' + (showCoffeeTypes ? 'coffee-button-selected' : '')
          }
        >
          <h4>Other</h4>
          <p>n/a</p>
        </button>
      </div>
      {/* MARK: Select Types */}
      {showCoffeeTypes && (
        <select
          onChange={(e) => setSelectedCoffee(e.target.value)}
          name="coffee-list"
          id="coffee-list"
        >
          <option value={null}>Select Type</option>
          {coffeeOptions.map((option, optionIndex) => {
            return (
              <option value={option.name} key={optionIndex}>
                {option.name} ({option.caffeine}mg)
              </option>
            );
          })}
        </select>
      )}
      {/* MARK: Add COST */}
      <h4>Add the cost ($)</h4>
      <input
        type="number"
        className="w-full"
        value={coffeeCost}
        onChange={(e) => setCoffeeCost(e.target.value)}
        placeholder="4.50"
      />
      <h4>Time since consumption</h4>
      <div className="time-entry">
        {/* MARK: Select Time */}
        <div>
          <h6>Hours</h6>
          <select onChange={(e) => setHour(e.target.value)} id="hours-select">
            {[
              0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18,
              19, 20, 21, 22, 23,
            ].map((hour, hourIndex) => {
              return (
                <option key={hourIndex} value={hour}>
                  {hour}
                </option>
              );
            })}
          </select>
        </div>
        <div>
          <h6>Mins</h6>
          <select onChange={(e) => setMin(e.target.value)} id="mins-select">
            {[0, 5, 10, 15, 30, 45].map((min, minIndex) => {
              return (
                <option key={minIndex} value={min}>
                  {min}
                </option>
              );
            })}
          </select>
        </div>
      </div>
      {/* MARK: Submit Button */}
      <button onClick={handleSubmitForm}>
        <p>Add Entry</p>
      </button>
    </>
  );
}
