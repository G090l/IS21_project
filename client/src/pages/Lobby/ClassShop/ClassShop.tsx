import React, { useContext, useState } from 'react';
import cn from 'classnames';
import { ServerContext, StoreContext } from '../../../App';
import Button from '../../../components/Button/Button';
import { IBasePage } from '../../PageManager';

import warriorPortrait from '../../../assets/img/classShop/warriorPortrait.png';
import warriorDescription from '../../../assets/img/classShop/warriorDescription.png';
import magePortrait from '../../../assets/img/classShop/magePortrait.png';
import mageDescription from '../../../assets/img/classShop/mageDescription.png';
import './ClassShop.scss';


interface IClassShop extends IBasePage {
    isOpen: boolean;
    onClose: () => void;
}

const ClassShop: React.FC<IClassShop> = (props) => {
    const { isOpen, onClose } = props;
    const server = useContext(ServerContext);
    const store = useContext(StoreContext);
    const [activeSection, setActiveSection] = useState<'warrior' | 'mage'>('warrior');
    const [selectedClass, setSelectedClass] = useState<number | null>(store.getUser()?.selectedClass ?? null);
    const [user, setUser] = useState(() => store.getUser());

    const selectClassClickHandler = async (id: number) => {
        const success = await server.selectClass(id);
        if (success) {
            setSelectedClass(id);
        }
    };
    const buyClassClickHandler = async (id: number) => {
        const success = await server.buyClass(id);
        if (success) {
            const updatedUser = await server.getUserInfo();
            if (updatedUser) {
                setUser(updatedUser);
            }
        }
    };

    const backClickHandler = () => {
        onClose();
    };

    const renderRightSection = () => {
        switch (activeSection) {
            case 'warrior':
                return (
                    <div className="right-section">
                        <div className="warrior-section">
                            <img
                                src={warriorPortrait}
                                className="warriorPortrait"
                            />
                            <img
                                src={warriorDescription}
                                className="warriorDescription"
                            />
                            {user?.purchasedClasses.includes(1) ? (
                                <Button
                                    onClick={() => selectClassClickHandler(1)}
                                    className={cn('choose-button', { 'active': selectedClass === 1 })}
                                />
                            ) : (
                                <Button
                                    onClick={() => buyClassClickHandler(1)}
                                    className='buy-button'
                                />
                            )}
                            <Button
                                onClick={backClickHandler}
                                className='back-button'
                            />
                        </div>
                    </div>
                );

            case 'mage':
                return (
                    <div className="right-section">
                        <div className="mage-section">
                            <img
                                src={magePortrait}
                                className="magePortrait"
                            />
                            <img
                                src={mageDescription}
                                className="mageDescription"
                            />
                            {user?.purchasedClasses.includes(2) ? (
                                <Button
                                    onClick={() => selectClassClickHandler(2)}
                                    className={cn('choose-button', { 'active': selectedClass === 2 })}
                                />
                            ) : (
                                <Button
                                    onClick={() => buyClassClickHandler(2)}
                                    className='buy-button'
                                />
                            )}
                            <Button
                                onClick={backClickHandler}
                                className='back-button'
                            />
                        </div >
                    </div>
                );
        }
    };

    return (<div
        className={cn('classShop', { 'classShop-open': isOpen })}
    >
        <div className='classShop-window'>
            <div className='left-section'>
                <Button
                    onClick={() => setActiveSection('warrior')}
                    className={cn('warriorSection-button', {
                        'active': activeSection === 'warrior'
                    })}
                />
                <Button
                    onClick={() => setActiveSection('mage')}
                    className={cn('mageSection-button', {
                        'active': activeSection === 'mage'
                    })}
                />
                <Button
                    onClick={() => { }}
                    className="others-button"
                />
                <Button
                    onClick={() => { }}
                    className="others2-button"
                />

            </div>
            {renderRightSection()}
        </div>
    </div >)
}

export default ClassShop;