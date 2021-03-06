import * as React from 'react';
import { SvgIcon } from '../ui';

/**
 * Material design icons
 * https://github.com/google/material-design-icons
 */
export class MenuIcon extends SvgIcon {
    public renderIcon() {
        return (
            <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
        );
    }
}

