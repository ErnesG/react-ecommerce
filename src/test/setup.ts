import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';
// cleans dom before each test
afterEach (() => {
    cleanup();
});