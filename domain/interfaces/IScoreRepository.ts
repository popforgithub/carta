import ScoreId from "~/domain/Score/ScoreId"
import Score from "~/domain/Score"

export default interface IScoreRepository {

  getAll(matchId: string): Promise<Array<Score>>

  findById(id: ScoreId): Promise<Score>

  create(score: Score): Promise<void>

  update(score: Score): Promise<void>

  delete(id: ScoreId): Promise<void>
}