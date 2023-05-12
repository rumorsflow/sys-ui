package main

import (
	"bytes"
	"encoding/json"
	"flag"
	"github.com/evanw/esbuild/pkg/api"
	"github.com/joho/godotenv"
	"io"
	"io/fs"
	"log"
	"os"
	"path/filepath"
	"strings"
	"unsafe"
)

var (
	script          = []byte("<script type=\"module\" src=\"/src/main.tsx\"></script>\n")
	closeTitle      = []byte("</title>\n")
	addScriptPrefix = []byte("  <script type=\"module\" crossorigin src=\"")
	addScriptSuffix = []byte("\"></script>\n")

	loader = map[string]api.Loader{
		"":      api.LoaderJS, // This represents files without an extension
		".js":   api.LoaderJS,
		".mjs":  api.LoaderJS,
		".cjs":  api.LoaderJS,
		".jsx":  api.LoaderJSX,
		".ts":   api.LoaderTS,
		".cts":  api.LoaderTS,
		".mts":  api.LoaderTS,
		".tsx":  api.LoaderTSX,
		".css":  api.LoaderCSS,
		".json": api.LoaderJSON,
		".txt":  api.LoaderText,
		".html": api.LoaderFile,
		".png":  api.LoaderFile,
		".jpg":  api.LoaderFile,
		".jpeg": api.LoaderFile,
		".svg":  api.LoaderFile,
	}

	engines = []api.Engine{
		{api.EngineChrome, "63"},
		{api.EngineFirefox, "67"},
		{api.EngineSafari, "11.1"},
		{api.EngineEdge, "79"},
	}

	envPlugin = api.Plugin{
		Name: "env",
		Setup: func(build api.PluginBuild) {
			build.OnLoad(api.OnLoadOptions{Filter: "./meta"},
				func(args api.OnLoadArgs) (api.OnLoadResult, error) {
					mappings := map[string]any{
						"MODE": "production",
						"PROD": true,
						"DEV":  false,
						"SSR":  false,
					}

					for _, item := range os.Environ() {
						if strings.HasPrefix(item, "BASE_URL") || strings.HasPrefix(item, "VITE_") {
							if equals := strings.IndexByte(item, '='); equals != -1 {
								mappings[item[:equals]] = item[equals+1:]
							}
						}
					}

					bytes, err := json.Marshal(mappings)
					if err != nil {
						return api.OnLoadResult{}, err
					}

					contents := "export const env = " + string(bytes)

					return api.OnLoadResult{
						Contents: &contents,
						Loader:   api.LoaderTS,
					}, nil
				})
		},
	}

	imagePlugin = api.Plugin{
		Name: "image",
		Setup: func(build api.PluginBuild) {
			build.OnLoad(api.OnLoadOptions{Filter: `.jpg|.jpeg|.png|.svg`},
				func(args api.OnLoadArgs) (api.OnLoadResult, error) {
					src, err := os.ReadFile(args.Path)
					if err != nil {
						log.Fatal(err)
					}

					return api.OnLoadResult{
						Contents: (*string)(unsafe.Pointer(&src)),
						Loader:   api.LoaderFile,
					}, nil
				})
		},
	}

	baseURL = ""
	dstPath string
	dotenv  string
	dstRm   bool
)

func init() {
	flag.StringVar(&dotenv, "dotenv", ".env", ".env filename")
	flag.StringVar(&dstPath, "dst", "dist", "destination build")
	flag.BoolVar(&dstRm, "rm", false, "remove destination")
	flag.Parse()

	if _, err := os.Stat(dotenv); err == nil {
		if err = godotenv.Load(dotenv); err != nil {
			log.Fatal(err)
		}
	}

	baseURL = os.Getenv("BASE_URL")
}

func main() {
	if dstRm {
		if err := os.RemoveAll(dstPath); err != nil {
			log.Fatal(err)
		}
	}

	result := api.Build(api.BuildOptions{
		EntryPoints:       []string{"src/main.tsx"},
		Loader:            loader,
		Bundle:            true,
		MinifyWhitespace:  true,
		MinifyIdentifiers: true,
		MinifySyntax:      true,
		Splitting:         true,
		Write:             true,
		Engines:           engines,
		Plugins:           []api.Plugin{envPlugin, imagePlugin},
		Target:            api.ES2015,
		Format:            api.FormatESModule,
		Outdir:            dstPath,
		PublicPath:        baseURL,
	})

	if len(result.Errors) > 0 {
		log.Fatal(result.Errors)
	}

	copyIndexHTML(baseURL)

	copyPublic()
}

func copyIndexHTML(baseUrl string) {
	src, err := os.ReadFile("index.html")
	if err != nil {
		log.Fatal(err)
	}

	src = bytes.Replace(src, script, nil, 1)
	src = bytes.Replace(src, []byte("/RF.svg"), []byte(filepath.Join(baseUrl, "RF.svg")), 1)

	index := bytes.Index(src, closeTitle)

	s := append([]byte{}, src[:index+len(closeTitle)]...)
	s = append(s, addScriptPrefix...)
	s = append(s, []byte(filepath.Join(baseUrl, "main.js"))...)
	s = append(s, addScriptSuffix...)
	s = append(s, src[index+len(closeTitle):]...)

	if err = os.WriteFile(filepath.Join(dstPath, "index.html"), s, 0666); err != nil {
		log.Fatal(err)
	}
}

func copyPublic() {
	if err := filepath.Walk("public/", func(path string, info fs.FileInfo, err error) error {
		if err != nil {
			return err
		}

		if info.IsDir() {
			return nil
		}

		return copyFile(path, filepath.Join(dstPath, info.Name()))
	}); err != nil {
		log.Fatal(err)
	}
}

func copyFile(src, dst string) error {
	fin, err := os.Open(src)
	if err != nil {
		return err
	}
	defer fin.Close()

	fout, err := os.Create(dst)
	if err != nil {
		return err
	}
	defer fout.Close()

	_, err = io.Copy(fout, fin)
	return err
}
