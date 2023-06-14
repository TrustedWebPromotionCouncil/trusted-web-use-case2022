use std::error::Error;
use hyper::{body::HttpBody, Client, Method, Request, Body};
use hyperlocal::{UnixClientExt, Uri};
use tokio::io::{self, AsyncWriteExt as _};
use dirs::home_dir;

#[tokio::main]
async fn main() -> Result<(), Box<dyn Error + Send + Sync>> {
    let home = match home_dir() {
        Some(v) => v,
        _ => panic!()
    };
    let socket_path_buf = home.as_path().join(".unid/run/unid.sock");
    let socket_path = match socket_path_buf.to_str() {
        Some(v) => v.to_string(),
        _ => panic!()
    };

    let uri = Uri::new(&socket_path, "/identifiers");
    let client = Client::unix();

    let request = Request::builder()
        .method(Method::POST)
        .uri(uri)
        .header("content-type", "application/json")
        .body(Body::from(""))
        .unwrap();

    let mut response = client.request(request).await?;

    while let Some(next) = response.data().await {
        let chunk = next?;
        io::stdout().write_all(&chunk).await?;
    }

    Ok(())
}