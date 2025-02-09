console.log('Jest setup file loaded!');
import '@testing-library/jest-dom';
import { TextEncoder } from 'util';

global.TextEncoder = TextEncoder;
