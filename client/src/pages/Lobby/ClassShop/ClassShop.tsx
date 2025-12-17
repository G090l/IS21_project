import React from 'react';
import cn from 'classnames';
import Button from '../../../components/Button/Button';
import { IBasePage } from '../../PageManager';
import './ClassShop.scss';

interface IClassShop extends IBasePage {
    isOpen: boolean;
    onClose: () => void;
}

const ClassShop: React.FC<IClassShop> = (props) => {
    const { isOpen, onClose } = props;

    const backClickHandler = () => {
        onClose();
    };

    return (<div
        className={cn('classShop', { 'classShop-open': isOpen })}
    >
        <div className='classShop-window'>
            <Button
                onClick={backClickHandler}
                className='back-button'
            />
        </div>
    </div>)
}

export default ClassShop;