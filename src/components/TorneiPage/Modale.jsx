import "./Modale.css";

// eslint-disable-next-line react/prop-types
const Modale = ({ isOpen, onClose, squadre, onSelectSquadra }) => {
  if (!isOpen) return null;

  return (
    <div className="modale-overlay">
      <div className="modale-content">
        <button className="modale-close" onClick={onClose}>
          ×
        </button>
        <h3>Seleziona una Squadra</h3>
        <ul className="squadre-list">
          {squadre.map((squadra) => (
            <li key={squadra.id} onClick={() => onSelectSquadra(squadra)}>
              <img src={squadra.avatar} alt={squadra.nome} className="squadra-avatar" />
              {squadra.nome}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Modale;
