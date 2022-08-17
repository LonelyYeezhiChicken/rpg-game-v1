
import { Dao } from "./interfaces/dao";

/**
 * LocalStorage
 */
export class LocalStorageDao implements Dao {

    /**
    * 建立
    * @param key 唯一值
    * @param value 參數內容
    */
    create<T>(key: string, value: T): void {
        // 序列化物件
        let data: string = JSON.stringify(value);
        // 存入
        localStorage.setItem(key, data);
    }
    /**
   * 讀取
   * @param key 唯一值
   */
    read<T>(key: string): T {
        return <T>localStorage.getItem(key);
    }
    /**
    * 更新
    * @param key 唯一值
    * @param value 參數內容 
    */
    update<T>(key: string, value: T): void {
        // 序列化物件
        let data: string = JSON.stringify(value);
        // 存入
        localStorage.setItem(key, data);
    }
    /**
    * 刪除
    * @param key 唯一值
    */
    delete(key: string): void {
        localStorage.removeItem(key);
    }

}