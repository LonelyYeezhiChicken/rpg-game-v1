import { Dao, CookieDao } from '../../../dao/index'
import { HealthPointDto } from "../../../models/index";

export class HealthPointRepository {
    private readonly firstKey: string;
    private readonly dao: Dao;

    constructor() {
        this.firstKey = "HealthPointRepository";
        this.dao = new CookieDao();
    }

    /**建立血量
     * 
     * @param data 
     */
    public create(data: HealthPointDto): void {
        if (this.read() === null)
            this.dao.create<HealthPointDto>(this.firstKey, data);
        else
            this.delete();
    }

    /**取得血量
     * 
     * @returns 
     */
    public read(): HealthPointDto | null {
        const data: HealthPointDto | null = this.dao.read<HealthPointDto>(this.firstKey);
        return data ?? null;
    }

    /**更新血量
     * 
     * @param data 
     */
    public update(data: HealthPointDto): void {
        this.dao.update<HealthPointDto>(this.firstKey, data);
    }

    /**刪除設定 */
    public delete(): void {
        this.dao.delete(this.firstKey);
    }
}