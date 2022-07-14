import { FC } from 'react'
import { withIronSessionSsr } from 'iron-session/next'
import { format } from 'date-fns'
import { sessionOptions } from '../../../utils/session'
import { getFromApi } from '../../../utils/api'
import DATE_FORMAT from '../../../constants/date'
import MESSAGES from '../../../constants/messages'
import getItems from '../../../utils/summary'
import { Document } from '../../../utils/types'

const DocumentSummary: FC<Document> = ({
    title,
    questions,
    answers,
    created_at: createdAt,
}) => {
    return (
        <>
            <header className='prose'>
                <h1>{title}</h1>
                <time>
                    {MESSAGES.document.createdAt}:{' '}
                    {format(createdAt, DATE_FORMAT)}
                </time>
            </header>
            {questions &&
                getItems(questions, answers).map(
                    ({ question, answer }, index) => (
                        <div
                            key={index}
                            className='prose'>
                            <h3>{question}</h3>
                            {Array.isArray(answer) && answer.length ? (
                                <ul>
                                    {answer.map((item, ind) => (
                                        <li key={ind}>{item}</li>
                                    ))}
                                </ul>
                            ) : (
                                <h5>{answer}</h5>
                            )}
                        </div>
                    )
                )}
        </>
    )
}

export default DocumentSummary

type DocumentResponse = Omit<Document, 'documentId'>

export const getServerSideProps = withIronSessionSsr(async function ({
    req,
    res,
    query,
}) {
    const { documentId } = query
    const { token } = req.session
    let title, questions, answers, created_at

    if (!token) {
        res.setHeader('location', '/auth')
        res.statusCode = 302
        res.end()
    } else {
        const response: DocumentResponse = await getFromApi(
            'document',
            documentId,
            token
        )

        title = response.title
        questions = response.questions
        answers = response.answers
        created_at = response.created_at
    }
    return {
        props: { title, questions, answers, created_at },
    }
},
sessionOptions)
