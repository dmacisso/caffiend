import { useState } from 'react';
import Authentication from './Authentication';
import Modal from './Modal';
import { useAuth } from '../context/AuthContext';

/* eslint-disable react/prop-types */
export default function Layout(props) {
  const { children } = props;

  const [showModal, setShowModal] = useState(false);

  const { globalUser, logout } = useAuth();

  const header = (
    <header>
      <div>
        <h1 className="text-gradient">CAFFIEND</h1>
        <p>For Coffee Insatiates</p>
      </div>
      {globalUser ? (
        <button onClick={logout}>
          <p>Logout</p>
        </button>
      ) : (
        <button onClick={() => setShowModal(true)}>
          <p>Sign up free</p>
          <i className="fa-solid fa-mug-hot"></i>
        </button>
      )}
    </header>
  );
  const footer = (
    <footer>
      <p>
        <span className="text-gradient"> Caffiend </span>was made by{' '}
        <a href="https://github.com/dmacisso" target="_blank">
          {' '}
          DVMacisso
        </a>{' '}
        <br /> using React and Vite and{' '}
        <a href="https://www.fantacss.smoljames.com" target="_blank">
          FantaCSS
        </a>{' '}
        design library <br /> Check out the code on{' '}
        <a href="https://github.com/dmacisso/caffiend" target="_blank">
          Github!
        </a>{' '}
      </p>
    </footer>
  );

  function handleCloseModal() {
    setShowModal(false);
  }
  return (
    <>
      <main>
        {showModal && (
          <Modal handleCloseModal={handleCloseModal}>
            <Authentication handleCloseModal={handleCloseModal} />
          </Modal>
        )}
        {header}
        {children}
        {footer}
      </main>
    </>
  );
}
