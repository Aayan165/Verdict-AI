/**
 * @typedef {Object} AuthSession
 * @property {string} accessToken
 * @property {string} refreshToken
 * @property {string} tokenType
 */

/**
 * @typedef {Object} EvaluationRecord
 * @property {number} id
 * @property {string} prompt
 * @property {string} response
 * @property {number} accuracy_score
 * @property {number} logic_score
 * @property {number} completeness_score
 * @property {number} overall_score
 * @property {string} verdict
 * @property {string} summary
 * @property {string} created_at
 */

/**
 * @typedef {Object} ExperimentRecord
 * @property {number} id
 * @property {string} name
 * @property {string | null} description
 * @property {string} created_at
 */

export {};