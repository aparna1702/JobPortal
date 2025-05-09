    // import natural from 'natural';

    // const tokenize = (text) => {
    // const tokenizer = new natural.WordTokenizer();
    // return tokenizer.tokenize(text.toLowerCase());
    // };

    // const calculateATSScore = (resumeText, jobDesc) => {
    // const resumeTokens = tokenize(resumeText);
    // const jobTokens = tokenize(jobDesc);

    // const resumeSet = new Set(resumeTokens);
    // const jobSet = new Set(jobTokens);

    // const matchCount = [...jobSet].filter(word => resumeSet.has(word)).length;
    // const score = (matchCount / jobSet.size) * 100;

    // return Math.round(score * 100) / 100;
    // };

    
    
    // export { calculateATSScore, getRecommendedJobs };

    import natural from 'natural';

    const tokenizer = new natural.WordTokenizer();
    const TfIdf = natural.TfIdf;
    const tfidf = new TfIdf();
    
    const preprocess = (text) => tokenizer.tokenize(text.toLowerCase()).join(" ");
    
    const calculateATSScore = (resumeText, qualificationText) => {
        const resume = preprocess(resumeText);
        const qualifications = preprocess(qualificationText);
    
        // Clear previous documents
        tfidf.documents = [];
    
        tfidf.addDocument(qualifications);
        tfidf.addDocument(resume);
    
        // Compare similarity using cosine distance
        const vecA = tfidf.listTerms(0).reduce((acc, term) => {
            acc[term.term] = term.tfidf;
            return acc;
        }, {});
    
        const vecB = tfidf.listTerms(1).reduce((acc, term) => {
            acc[term.term] = term.tfidf;
            return acc;
        }, {});
    
        const allTerms = new Set([...Object.keys(vecA), ...Object.keys(vecB)]);
        let dotProduct = 0, normA = 0, normB = 0;
    
        allTerms.forEach(term => {
            const valA = vecA[term] || 0;
            const valB = vecB[term] || 0;
            dotProduct += valA * valB;
            normA += valA * valA;
            normB += valB * valB;
        });
    
        if (normA === 0 || normB === 0) return 0;
    
        const similarity = dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
        return Math.round(similarity * 10000) / 100; // Return score as percentage
    };

    const getRecommendedJobs = (resumeText, jobList) => {
        return jobList
        .map(job => ({
            ...job,
            atsScore: calculateATSScore(resumeText, job.description)
        }))
        .filter(job => job.atsScore >= 80);
    };
    
    export { calculateATSScore, getRecommendedJobs };
    