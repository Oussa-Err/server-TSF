class ApiFeatures {
    constructor(query, queryStr) {
        this.query = query
        this.queryStr = queryStr
    }

    //ADVANCE FILTERING`
    filter() {
        let queryString = JSON.stringify(this.queryStr)
        queryString = queryString.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`)
        const queryObj = JSON.parse(queryString)

        this.query = this.query.find(queryObj)

        return this
    }

    // SORTING LOGIC
    sort() {
        console.log(this.queryStr)
        if (this.queryStr.sort) {
            const sortBy = this.queryStr.sort.split(',').join(' ');
            this.query = this.query.sort(sortBy);
        } else {
            this.query = this.query.sort('-createdAt');
        }
        return this
    }

    // QUERY FIELDS
    limitFields() {
        if (this.queryStr.fields) {
            const fields = this.queryStr.fields.split(',').join(' ')
            this.query = this.query.select(fields)
        } else {
            this.query = this.query.select('-__v')
        }

        return this
    }

    //PAGINATION
    paginate() {
        const page = this.queryStr.page * 1 || 1
        const limit = this.queryStr.limit * 1 || 10
        const skip = (page - 1) * limit
        this.query = this.query.skip(skip).limit(limit)

        // if (this.queryStr) {
        //     const countDocs = this.query.countDocuments()
        //     if (skip >= countDocs) {
        //         throw new Error('this page is not found')
        //     }
        // }

        return this
    }
}

module.exports = ApiFeatures