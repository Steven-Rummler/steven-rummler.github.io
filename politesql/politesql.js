
function politesql(query) {
    // Remove strings
    query = query.replaceAll('\'\'', 'emptystringplaceholder');
    const quoteSegments = query.split('\'');
    const strings = quoteSegments.filter((_, index) => index % 2 === 1);
    query = quoteSegments.filter((_, index) => index % 2 === 0).join('\'\'');

    // Clean up spaces
    query = query.trim(); // Remove leading and trailing spaces
    query = query.replaceAll(/\s+/g, ' '); // Remove multiple spaces

    query = query.replaceAll(/\s+,/g, ','); // Remove spaces before comma
    query = query.replaceAll(/,(?!\s)/g, ', '); // Add space after comma

    query = query.replaceAll(/\s+\(/g, '('); // Remove spaces before opening paren
    query = query.replaceAll(/(?<=[Ff][Rr][Oo][Mm]|[Jj][Oo][Ii][Nn]|[Ii][Nn]|[Aa][Ss]|[Oo][Vv][Ee][Rr])\(/g, ' ('); // Add space before opening paren for certain keywords
    query = query.replaceAll(/\(\s/g, '('); // Remove spaces after opening paren

    query = query.replaceAll(/\s\)/g, ')'); // Remove spaces before closing paren
    query = query.replaceAll(/\)(?![\s;])/g, ') '); // Add space after closing paren

    query = query.replaceAll(/\(\s+\(/g, '(('); // Remove spaces before closing paren
    query = query.replaceAll(/\)\s+\)/g, '))'); // Remove spaces before closing paren

    query = query.replaceAll(/\s?\+\s?/g, ' + ') // Add spaces around plus
    query = query.replaceAll(/\s?\-\s?/g, ' - ') // Add spaces around minus
    query = query.replaceAll(/\s?\*\s?/g, ' * ') // Add spaces around times
    query = query.replaceAll(/\s?\/\s?/g, ' / ') // Add spaces around over
    query = query.replaceAll(/\s?\%\s?/g, ' % ') // Add spaces around mod

    query = query.replaceAll(/;\s*/g, ';\n\n'); // Add newlines after semicolon

    // Handle keywords
    const indentKeywords = ['with', 'select', 'from', 'where', 'group by', 'having', 'order by', 'union', 'limit'];
    const minorKeywords = ['as', 'distinct', 'global', 'on', 'and', 'or', 'all',
        'over', 'partition by', 'rows', 'range', 'between', 'preceding', 'following'];
    const joinOptions = [
        ['global'],
        ['any', 'all', 'asof'],
        ['inner', 'left', 'right', 'full', 'cross'],
        ['outer', 'semi', 'anti'],
        ['join']
    ];
    const allKeywords = [...indentKeywords, ...minorKeywords, ...joinOptions.flat()];
    allKeywords.forEach(keyword => {
        // Lowercase
        const keywordRegex = keyword.split('').map(letter => '[' + letter.toUpperCase() + letter + ']').join('');
        const keywordRegexSpacesOrParensAround = '\\b' + keywordRegex + '\\b';
        const keywordMatch = new RegExp(keywordRegexSpacesOrParensAround, 'g');
        query = query.replaceAll(keywordMatch, keyword);

        if (indentKeywords.includes(keyword)) {
            // New Lines
            const keywordRegexSpacesOrParensAfter = keywordRegex + '\\b';
            const spaceBeforeKeywordRegex = '\\s(?=' + keywordRegexSpacesOrParensAfter + ')';
            const spaceBeforeKeywordMatch = new RegExp(spaceBeforeKeywordRegex, 'g');
            query = query.replaceAll(spaceBeforeKeywordMatch, '\n');

            // Clean up split keywords
            const splitKeywordRegex = keyword.replaceAll(' ', '\\s+');
            const splitKeywordMatch = new RegExp(splitKeywordRegex, 'g');
            query = query.replaceAll(splitKeywordMatch, keyword);
        }
    });
    // Handle newlines for joins
    const queryLinesJoins = query.split('\n');
    queryLinesJoins.forEach((queryLine, index, queryLines) => {
        if (queryLine.includes('join')) {
            const words = queryLine.split(' ');
            const joinIndex = words.findIndex(e => e === 'join');
            if (joinIndex > 0) {
                let newLineIndex = joinIndex;
                let validJoinPrefixes = true;
                while (newLineIndex > 0 && validJoinPrefixes) {
                    if (joinOptions.flat().includes(words[newLineIndex - 1])) newLineIndex -= 1;
                    else validJoinPrefixes = false;
                }
                words[newLineIndex] = '\n' + words[newLineIndex];
                queryLines[index] = words.join(' ');
            }
        }
    });
    query = queryLinesJoins.join('\n');

    // Indentation
    const queryLinesIndent = query.split('\n');
    let indentLevel = 0;
    queryLinesIndent.forEach((queryLine, index, queryLines) => {
        queryLines[index] = '  '.repeat(indentLevel) + queryLine;
        indentLevel += queryLine.split('(').length - 1;
        indentLevel -= queryLine.split(')').length - 1;
    });
    query = queryLinesIndent.join('\n');

    // Replace strings
    strings.forEach(string => {
        query = query.replace('\'\'', '\'' + string + '\'');
    })
    query = query.replaceAll('emptystringplaceholder', '\'\'');

    // Final Trim
    query = query.trim(); // Remove leading and trailing spaces

    return query;
}