mocha.setup('bdd');
chai.should()

describe('MorseCodec', function() {

    before(function() {
        morse = new MorseCodec();
    });

    it('should encode text correctly (plain spaceless code)', function() {
        morse.encode('hi you').should.equal('......-.-----..-');
    });

    it('should encode text correctly (code with spaces)', function() {
        morse.encodeWithSpacing('hi you').should.equal('. . . .   . .       - . - -   - - -   . . -');
    });

    it('should decode custom correct text correctly', function() {
        morse.decode('. . . .   . .       - . - -   - - -   . . -').should.equal('hi you');
    });

    it('should decode previously encoded text correctly', function() {
        morse.decode(morse.encodeWithSpacing('hi you')).should.equal('hi you');
    });    

    it('should return "undefined" while decoding incorrect text', function() {
        (typeof morse.decode('. . . . . .       - . - -   - - -   . . -')).should.equal('undefined');
    });
    
    it('should produce code with spaces consistent with the plain code', function() {
        var code1 = morse.encode('hello world');
        var code2 = morse.encodeWithSpacing('hello world').split(' ').join('');
        code1.should.equal(code2);
    });

    it('should find symbol by its code in the Morse table', function() {
        morse.getSymbolByCode('.-').should.equal('a');
        morse.getSymbolByCode('.--.-.').should.equal('@');
    });

    it('should return "undefined" while trying to find a symbol by non-existing code', function() {
        (typeof morse.getSymbolByCode('.--.-.-')).should.equal('undefined');
    });

    it('should return "undefined" while trying to find a symbol by empty code', function() {
        (typeof morse.getSymbolByCode('')).should.equal('undefined');
    });    
});
