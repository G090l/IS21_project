import React, { useContext, useState } from 'react';
import cn from 'classnames';
import { ServerContext} from '../../../App';
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
    const [activeSection, setActiveSection] = useState<'warrior' | 'mage'>('warrior');
    const [selectedClass, setSelectedClass] = useState<string | null>(null);

    const selectClassClickHandler = async (id: number, type: string) => {
        const success = await server.selectClass(id);
        if (success) {
            setSelectedClass(type);
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
                            <Button
                                onClick={() => selectClassClickHandler(1, 'warrior')}
                                className={cn('choose-button', { 'active': selectedClass === 'warrior' })}
                            />
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
                            <Button
                                onClick={() => selectClassClickHandler(2, 'mage')}
                                className={cn('choose-button', { 'active': selectedClass === 'mage' })}
                            />
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