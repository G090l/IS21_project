import React from 'react';
import cn from 'classnames';
import Button from '../../../components/Button/Button';
import { IBasePage } from '../../PageManager';
import './ClassShop.scss';

interface IClassShop extends IBasePage {
    isOpen: boolean;
    onToggle: (isOpen: boolean) => void;
}

const ClassShop: React.FC<IClassShop> = (props) => {
    const { isOpen, onToggle } = props;

    const backClickHandler = () => {
        onToggle(false);
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