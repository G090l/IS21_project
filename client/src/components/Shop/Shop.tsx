import React from 'react';

interface ShopProps {
    isOpen: boolean;
    onToggle: (isOpen: boolean) => void;
}

const Shop: React.FC<ShopProps> = ({ isOpen, onToggle }) => {
    if (!isOpen) return null;

    {/*const handleClose = () => {
        onToggle(false);
    };
    */}

    return (
        <div className="shop-overlay">
            <div className="shop-modal">
                <div className="shop-header">
                    <h2>Магазин</h2>
                    {/*<button className="shop-close" onClick={handleClose}>×</button>*/}
                </div>
                <div className="shop-content">
                    <div className="shop-categories">
                        <button className="shop-category-button-armor" onClick={() => ('броня')}>
                            Броня
                        </button>
                        <button className="shop-category-button-legs" onClick={() => ('низ')}>
                            Низ
                        </button>
                        <button className="shop-category-button-helmet" onClick={() => ('шлем')}>
                            Шлем
                        </button>
                        <button className="shop-category-button-swords" onClick={() => ('мечи')}>
                            Мечи
                        </button>
                        <button className="shop-category-button-bows" onClick={() => ('луки')}>
                            Луки
                        </button>
                        <button className="shop-category-button-arrows" onClick={() => ('стрелы')}>
                            Купить стрелы
                        </button>
                        <button className="shop-category-button-poitions" onClick={() => ('зелья')}>
                            Купить зелья
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Shop;