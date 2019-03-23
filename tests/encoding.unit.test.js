import { decodeCursor, encodeCursor } from '../src/helpers/encoding';

describe('encoding helpers', () => {

    it('should transform a typical string into base64 format', () => {
        let str = 'test';
        let encoded = encodeCursor(str);
        expect(encoded).toMatch(/[A-Za-z0-9+/=]/);
        expect(encoded).not.toMatch(str);
    });

    it('should encode a string from ascii format into base64', () => {
        let str = 'test_again';
        let encoded = encodeCursor(str);
        let reverse = decodeCursor(encoded);
        expect(reverse).toMatch(str);
    });

    it('should convert an object into base64 string', () => {
        let obj = { demo: 'hi' };
        let encoded = encodeCursor(obj);
        expect(encoded).toMatch(/[A-Za-z0-9+/=]/);
    });

    it('should reformat an object from a base64 string', () => {
        let obj = { demo: 'hi' };
        let encoded = encodeCursor(obj);
        let reverse = decodeCursor(encoded);
        expect(reverse).toHaveProperty('demo', 'hi');
    });

});