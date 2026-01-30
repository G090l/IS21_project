import React, { useContext, useState } from 'react';
import cn from 'classnames';
import { ServerContext, StoreContext } from '../../../App';
import Button from '../../../components/Button/Button';
import './ItemShop.scss';

interface IItem {
    id: number;
    name: string;
    type: 'common' | 'hero';
    category: 'helmet' | 'chestplate' | 'leggings' | 'shield' | 'sword' | 'bow' | 'arrow' | 'potion';
    cost: number;
}

const items: IItem[] = [
    { id: 1, name: 'Стрела', type: 'common', category: 'arrow', cost: 4 },
    { id: 2, name: 'Зелье', type: 'common', category: 'potion', cost: 8 },
    { id: 3, name: 'Стандартный меч', type: 'common', category: 'sword', cost: 20 },
    { id: 4, name: 'Стандартный лук', type: 'common', category: 'bow', cost: 20 },
    { id: 5, name: 'Стандартный шлем', type: 'common', category: 'helmet', cost: 10 },
    { id: 6, name: 'Стандартный нагрудник', type: 'common', category: 'chestplate', cost: 10 },
    { id: 7, name: 'Стандартные поножи', type: 'common', category: 'leggings', cost: 10 },
    { id: 8, name: 'Стандартный щит', type: 'common', category: 'shield', cost: 10 },

    { id: 9, name: 'Меч героя', type: 'hero', category: 'sword', cost: 40 },
    { id: 10, name: 'Лук героя', type: 'hero', category: 'bow', cost: 40 },
    { id: 11, name: 'Шлем героя', type: 'hero', category: 'helmet', cost: 20 },
    { id: 12, name: 'Нагрудник героя', type: 'hero', category: 'chestplate', cost: 20 },
    { id: 13, name: 'Поножи героя', type: 'hero', category: 'leggings', cost: 20 },
    { id: 14, name: 'Щит героя', type: 'hero', category: 'shield', cost: 20 },
];

interface IItemShop {
    isOpen: boolean;
}

const ItemShop: React.FC<IItemShop> = (props) => {
    const { isOpen } = props;
    const server = useContext(ServerContext);
    const store = useContext(StoreContext);
    const [user, setUser] = useState(() => store.getUser());

    const buyItemClickHandler = async (id: number) => {
        const success = await server.buyItem(id);
        if (success) {
            const updatedUser = await server.getUserInfo();
            if (updatedUser) {
                setUser(updatedUser);
            }
        }
    };

    const sellItemClickHandler = async (id: number) => {
        const success = await server.sellItem(id);
        if (success) {
            const updatedUser = await server.getUserInfo();
            if (updatedUser) {
                setUser(updatedUser);
            }
        }
    };

    return (<div className={cn('itemShop', { 'itemShop-open': isOpen })}>
        <div className='itemShop-window'>
            {['common', 'hero'].map(type => (
                <div className={type === 'common' ? 'left-section' : 'right-section'}>
                    {items.filter(item => item.type === type).map(item => (
                        <div className={`${item.type}${item.category}`}>
                            <p>{`${item.name} ${item.cost} монет`}</p>
                            <div className="button-container">
                                {user?.purchasedItems.some(p => p.itemId === item.id) ? (
                                    <>
                                        <Button
                                            onClick={() => { }}
                                            className={cn('buy-button', 'active')}
                                        />
                                        <Button
                                            onClick={() => sellItemClickHandler(item.id)}
                                            className='sell-button'
                                            text='Продать'
                                        />
                                    </>
                                ) : (
                                    <Button
                                        onClick={() => buyItemClickHandler(item.id)}
                                        className='buy-button'
                                    />
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    </div>
    )
}

export default ItemShop;