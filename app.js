const http = require('http');
const url = require('url');

const MESSAGES = require('./lang/en/en');
const Dictionary = require('./dictionary');
const RequestTracker = require('./request_tracker');

class Server {
    constructor(port) {
        this.port = process.env.PORT || port;
        this.dictionary = new Dictionary();
        this.request_tracker = new RequestTracker();
    }

    start() {
        http.createServer((req, res) => {
            const req_url = url.parse(req.url, true);
            res.setHeader('Access-Control-Allow-Origin', '*');
            
            if (!req_url.pathname.startsWith('/api/definitions')) {
                // 400: incorrect api all syntax
                return res.status(400).json({message: MESSAGES.ERROR_MESSAGES.INVALID_API_CALL });
            }

            const sub_url = req_url.pathname.replace('/api/definitions', '');
            if (sub_url && sub_url !== '/') {
                // 400: incorrect api all syntax
                return res.status(400).json({message: MESSAGES.ERROR_MESSAGES.INVALID_API_CALL });
            }

            if (req.method === 'GET') {
                this.request_tracker.new_request();
                const { definition, error } = this.get_definition(req_url);
                if (error) {
                    // 404: not found, word is not in the dictionary.
                    return res.status(404).json({message: MESSAGES.ERROR_MESSAGES.WORD_DOES_NOT_EXIST });
                }
                // 200: successful request
                return res.status(200).json({definition: definition});
            }

            if (req.method === 'POST') {
                this.request_tracker.new_request();
                let body = '';
                req.on('data', (chunk) => {
                    body += chunk;
                });

                req.on('end', () => {
                    try {
                        const data = JSON.parse(body);
                        const word = data.word;
                        const definition = data.definition;

                        const add_word_result = this.dictionary.add_definition(word, definition);
                        if (!add_word_result) {
                            // 400: bad request, word already exists
                            return res.status(400).json({message: MESSAGES.ERROR_MESSAGES.WORD_ALREADY_EXISTS });
                        }

                        // 201: resource created
                        return res.status(201)
                        .json({
                            total_number_of_words: MESSAGES.USER_MESSAGES.TOTAL_NUMBER_OF_WORDS(this.dictionary.get_num_entries()),
                            total_number_of_requests: MESSAGES.USER_MESSAGES.TOTAL_NUMBER_OF_REQUEST(this.request_tracker.get_requests())
                        });
                    } catch (error) {
                        // 500: internal Server Error
                        return res.status(500).json({message: MESSAGES.ERROR_MESSAGES.SERVER_ERROR });
                    }
                });
                return;
            }

            // 405: method not allowed.
            return res.status(405).json({message: MESSAGES.ERROR_MESSAGES.METHOD_NOT_ALLOWED });

        }).listen(this.port, () => {
            console.log('Server running...');
        });
    }

    get_definition(req_url) {
        const requested_word = req_url.query.word;
        const definition = this.dictionary.get_definition(requested_word);
        return {
            definition: definition,
            error: definition === null,
        };
    }
}

module.exports = Server;
