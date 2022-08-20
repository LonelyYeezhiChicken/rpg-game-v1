import { Dao } from "./interfaces/dao";

export class CookieDao implements Dao {
    /**
     * 建立
     * @param key 唯一值
     * @param value 參數內容
     */
    create<T>(key: string, value: T): void {
        // 序列化物件
        let data: string = JSON.stringify(value);
        var date: Date = new Date();
        date.setTime(date.getTime() + (100 * 60 * 1000)); //100 minute
        let expires: string = "; expires=" + date.toString();

        document.cookie = encodeURIComponent(key) + "=" + encodeURIComponent(btoa(data)) + expires + "; path=/";
    }
    /**
   * 讀取
   * @param key 唯一值
   */
    read<T>(key: string): T | null {
        let nameEQ: string = encodeURIComponent(key) + "=";
        let ca: Array<string> = document.cookie.split(';');

        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) === ' ')
                c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) {

                let req: string = decodeURIComponent(c.substring(nameEQ.length, c.length));
                let newData: string = atob(req);
                return <T>JSON.parse(newData);
            }
        }
        return null;
    }
    /**
    * 更新
    * @param key 唯一值
    * @param value 參數內容 
    */
    update<T>(key: string, value: T): void {
        // 序列化物件
        let data: string = JSON.stringify(value);
        var date: Date = new Date();
        date.setTime(date.getTime() + (100 * 60 * 1000)); //100 minute
        let expires: string = "; expires=" + date.toString();

        document.cookie = encodeURIComponent(key) + "=" + encodeURIComponent(btoa(data)) + expires + "; path=/";
    }
    /**
    * 刪除
    * @param key 唯一值
    */
    delete(key: string): void {
        this.create(key, "");
    }

}