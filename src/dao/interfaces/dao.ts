export interface Dao {
    /**
     * 建立
     * @param key 唯一值
     * @param value 參數內容
     */
    create<T>(key: string, value: T): void;
    /**
     * 讀取
     * @param key 唯一值
     */
    read<T>(key: string): T | null;
    /**
     * 更新
     * @param key 唯一值
     * @param value 參數內容 
     */
    update<T>(key: string, value: T): void;
    /**
     * 刪除
     * @param key 唯一值
     */
    delete(key: string): void;
}